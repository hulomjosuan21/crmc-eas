import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SearchResultScreen extends StatelessWidget {
  const SearchResultScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final String? searchQuery = Get.parameters['query'];
    return Scaffold(
      body: Center(
        child: Text("Search Result Screen ${searchQuery ?? "No Query"}"),
      ),
    );
  }
}
