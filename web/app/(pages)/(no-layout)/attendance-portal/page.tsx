"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { toast } from "sonner";
import { ColumnDef, Table } from "@tanstack/react-table";
import {
  QrCode,
  Activity,
  History,
  Clock,
  User,
  IdCard,
  ScanLine,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

interface AttendanceRecord {
  attendanceId: string;
  studentSchoolId: string;
  studentName: string;
  timestamp: string;
  status: string;
}

export default function Page() {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>(
    []
  );
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  const recentActivity = useMemo(() => history.slice(0, 5), [history]);

  const socketRef = useRef<Socket | null>(null);
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const isLocked = useRef(false);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const formattedCameras = devices.map((d) => ({
            id: d.id,
            label: d.label || `Camera ${d.id}`,
          }));
          setCameras(formattedCameras);
          if (!selectedCameraId) {
            setSelectedCameraId(formattedCameras[0].id);
          }
        }
      })
      .catch((err) => console.error("Error getting cameras", err));

    socketRef.current = io(`${API_URL}/attendance`, {
      path: "/socket.io",
      transports: ["websocket"],
      upgrade: false,
    });

    socketRef.current.on("attendance_history", (data: AttendanceRecord[]) => {
      setHistory(data);
    });

    return () => {
      socketRef.current?.disconnect();
      if (html5QrCode.current?.isScanning) {
        html5QrCode.current.stop().catch((err) => console.error(err));
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }
  }, [isScanning, selectedCameraId]);

  const startScanner = async () => {
    if (!document.getElementById("webcam-view")) {
      return;
    }

    try {
      if (html5QrCode.current) {
        try {
          if (html5QrCode.current.isScanning) {
            await html5QrCode.current.stop();
          }
          html5QrCode.current.clear();
        } catch (err) {
          console.warn("Cleanup warning:", err);
        }
      }

      html5QrCode.current = new Html5Qrcode("webcam-view");
      const cameraIdOrConfig = selectedCameraId
        ? selectedCameraId
        : { facingMode: "environment" };

      const config = {
        fps: 15,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        ...(selectedCameraId
          ? {}
          : {
              videoConstraints: {
                width: { min: 640, ideal: 1280 },
                height: { min: 480, ideal: 720 },
                facingMode: "environment",
              },
            }),
      };

      await html5QrCode.current.start(
        cameraIdOrConfig,
        config,
        onScanSuccess,
        undefined
      );
    } catch (err) {
      toast.error("Camera failed to start.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCode.current && html5QrCode.current.isScanning) {
      try {
        await html5QrCode.current.stop();
        html5QrCode.current.clear();
      } catch (err) {
        toast.error("Failed to stop camera.");
      }
    }
  };

  const onScanSuccess = (decodedText: string) => {
    if (isLocked.current) return;
    isLocked.current = true;
    socketRef.current?.emit(
      "scan_attendance",
      { qrCode: decodedText },
      (res: any) => {
        if (res.status === "success") {
          toast.success(res.message);
          const newRecord = res.data;
          setHistory((prev) => [newRecord, ...prev]);
        } else {
          if (res.type === "already_attended") {
            toast.warning(res.message);
          } else {
            toast.error(res.message || "Scan failed");
          }
        }

        setTimeout(() => {
          isLocked.current = false;
        }, 2500);
      }
    );
  };

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      {
        header: "#",
        cell: (info) => (
          <span className="text-muted-foreground font-mono text-xs">
            {String(history.length - info.row.index)}
          </span>
        ),
      },
      {
        accessorKey: "studentSchoolId",
        header: "Student ID",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <IdCard className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono font-bold text-sm">
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "studentName",
        header: "Student name",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium">
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: (info) => (
          <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: () => <Badge className="text-[10px]">Present</Badge>,
      },
    ],
    []
  );

  const renderToolbar = useCallback(
    (table: Table<AttendanceRecord>) => (
      <DataTableToolbar
        table={table}
        searchKey="studentName"
        searchLabel="Student name"
      />
    ),
    []
  );

  const renderPagination = useCallback(
    (table: Table<AttendanceRecord>) => (
      <DataTablePagination
        table={table}
        pageSizeOptions={[10, 25, 50, 75, 100]}
      />
    ),
    []
  );

  return (
    <div className="flex flex-col min-h-screen lg:h-screen w-full bg-background text-foreground overflow-hidden">
      <header className="h-14 flex-none border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-bold tracking-wider uppercase">
            Gate<span className="text-muted-foreground">Keeper</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {cameras.length > 0 && (
            <Select
              value={selectedCameraId}
              onValueChange={(val) => {
                setSelectedCameraId(val);
              }}
            >
              <SelectTrigger size="sm" className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Select Device" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((cam) => (
                  <SelectItem key={cam.id} value={cam.id} className="text-xs">
                    {cam.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Label
            htmlFor="scanner-mode"
            className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground cursor-pointer"
          >
            {isScanning ? "SCANNING" : "STOPPED"}
          </Label>
          <Switch
            id="scanner-mode"
            checked={isScanning}
            onCheckedChange={setIsScanning}
            className="rounded-full data-[state=checked]:bg-primary"
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-muted/5 flex-none">
          <div className="relative w-full aspect-square bg-black overflow-hidden flex-none shadow-inner group">
            <div id="webcam-view" className="w-full h-full object-cover" />
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-10 bg-muted/10 backdrop-blur-sm">
                <ScanLine className="h-10 w-10 mb-3 opacity-50" />
                <p className="text-xs font-mono uppercase tracking-widest">
                  Camera Inactive
                </p>
              </div>
            )}

            {isScanning && (
              <>
                <div className="absolute inset-0 border-40 border-black/50 z-10 pointer-events-none transition-all duration-300">
                  <div className="w-full h-full border-2 border-primary/30 relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                  </div>
                </div>

                <div className="absolute inset-[40px] z-20 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-primary/50 shadow-[0_0_10px_#22c55e] animate-scan-down absolute top-0" />
                </div>
              </>
            )}
          </div>

          <div className="flex-1 flex flex-col bg-background overflow-hidden border-t border-border">
            <div className="flex-none p-3 border-b border-border bg-muted/20 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Recent
              </span>
              <Activity className="h-3 w-3 text-muted-foreground" />
            </div>

            <div className="flex-1 overflow-y-auto">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-border">
                  {recentActivity.map((record, index) => (
                    <div
                      key={record.attendanceId}
                      className={`p-2 flex flex-col gap-1 transition-colors ${
                        index === 0
                          ? "bg-primary/5 hover:bg-primary/10"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      {index === 0 && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">
                            Just Now
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div>
                          <p
                            className={`font-semibold leading-tight ${
                              index === 0
                                ? "text-lg text-primary"
                                : "text-sm text-foreground"
                            }`}
                          >
                            {record.studentName}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-1 flex items-center gap-1">
                            <IdCard className="h-3 w-3" />
                            {record.studentSchoolId}
                          </p>
                        </div>
                        {index === 0 && <Badge>NEW</Badge>}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">
                          {record.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground/40">
                  <QrCode className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs font-mono uppercase">
                    Waiting for scans...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-background min-h-[500px] lg:min-h-0">
          <div className="h-12 border-b border-border flex items-center px-2 py-1 gap-2 bg-background sticky top-0 z-10">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Attendance Log
            </span>
            <div className="ml-auto">
              <span className="text-xs font-mono bg-muted px-2 py-1">
                Count: {history.length}
              </span>
            </div>
          </div>

          <div className="px-2 overflow-auto">
            <DataTable
              columns={columns}
              data={history}
              toolbar={renderToolbar}
              pagination={renderPagination}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
