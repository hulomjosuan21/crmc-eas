import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme_context_extensions.dart';
import 'package:mobile/core/widget/small_generic_dropdown.dart';
import 'package:mobile/core/widget/styled_section_header.dart';
import 'package:mobile/screens/home/widget/event_card.dart';
import 'package:mobile/screens/home/widget/featured_events_list.dart';

class EventsTab extends StatefulWidget {
  const EventsTab({super.key});

  @override
  State<EventsTab> createState() => _EventsTabState();
}

class _EventsTabState extends State<EventsTab> {
  String _selectedDepartment = 'All Depts';
  final List<String> _departments = [
    'All Depts',
    'CCS',
    'CBA',
    'Engineering',
    'Nursing',
  ];

  Future<void> _handleRefresh() async {
    await Future.delayed(const Duration(seconds: 2));
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.color;

    return RefreshIndicator(
      onRefresh: _handleRefresh,
      color: colors.primary,
      backgroundColor: colors.background,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 5),
                  child: StyledSectionHeader(
                    title: "For you",
                    foregroundColor: colors.foreground,
                    accentColor: colors.primary,
                  ),
                ),
                const FeaturedEventsList(),
                const SizedBox(height: 10),
              ],
            ),
          ),

          SliverPersistentHeader(
            pinned: true,
            delegate: _StickyFilterDelegate(
              minHeight: 60.0,
              maxHeight: 60.0,
              child: Container(
                color: colors.secondary,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                alignment: Alignment.centerLeft,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    StyledSectionHeader(
                      title: "All",
                      foregroundColor: colors.foreground,
                      accentColor: colors.primary,
                    ),

                    SmallGenericDropdown<String>(
                      value: _selectedDepartment,
                      backgroundColor: colors.primary,
                      foregroundColor: colors.primaryForeground,
                      items: _departments
                          .map(
                            (dept) =>
                                GenericDropdownItem(value: dept, label: dept),
                          )
                          .toList(),
                      onChanged: (newValue) {
                        setState(() => _selectedDepartment = newValue!);
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 100),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                return const Padding(
                  padding: EdgeInsets.only(bottom: 20),
                  child: EventCard(),
                );
              }, childCount: 10),
            ),
          ),
        ],
      ),
    );
  }
}

class _StickyFilterDelegate extends SliverPersistentHeaderDelegate {
  final double minHeight;
  final double maxHeight;
  final Widget child;

  _StickyFilterDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    final isPinned = shrinkOffset > 0;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        boxShadow: isPinned
            ? [
                const BoxShadow(
                  color: Color.fromRGBO(0, 0, 0, 0.09),
                  blurRadius: 12,
                  spreadRadius: 0,
                  offset: Offset(0, 3),
                ),
              ]
            : [],
      ),
      child: child,
    );
  }

  @override
  double get maxExtent => maxHeight;

  @override
  double get minExtent => minHeight;

  @override
  bool shouldRebuild(_StickyFilterDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}
