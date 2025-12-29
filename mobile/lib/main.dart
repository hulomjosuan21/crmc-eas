import 'package:flutter/material.dart' hide Theme;
import 'package:get_storage/get_storage.dart';
import 'package:mobile/app.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mobile/core/providers/student_provider.dart';
import 'package:mobile/core/services/student_service.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Future.wait([
    GetStorage.init(),
    Hive.initFlutter(),
    dotenv.load(fileName: ".env.local"),
  ]);
  await Hive.openBox('student_cache');
  runApp(
    MultiProvider(
      providers: [
        Provider(create: (_) => StudentRepository()),
        ChangeNotifierProvider(
          create: (context) =>
              StudentProvider(context.read<StudentRepository>()),
        ),
      ],
      child: const App(),
    ),
  );
}
