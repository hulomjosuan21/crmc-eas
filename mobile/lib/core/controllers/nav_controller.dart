import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class NavController extends GetxController {
  final box = GetStorage();
  var currentIndex = 0.obs;

  @override
  void onInit() {
    super.onInit();
    currentIndex.value = box.read('nav_index') ?? 0;
  }

  void changeIndex(int index) {
    currentIndex.value = index;
    box.write('nav_index', index);
  }
}
