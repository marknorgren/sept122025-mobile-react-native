import React, { useCallback } from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type LongListProps<ItemT> = {
  data: readonly ItemT[];
  renderItem: ListRenderItem<ItemT>;
  keyExtractor?: (item: ItemT, index: number) => string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
  isLoadingMore?: boolean;
  loadingText?: string;
  loaderProps?: ActivityIndicatorProps;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  footerComponent?: React.ComponentType<any> | React.ReactElement | null;
  onEndReached?: FlatListProps<ItemT>["onEndReached"];
  onRefresh?: FlatListProps<ItemT>["onRefresh"];
  refreshing?: FlatListProps<ItemT>["refreshing"];
} & Omit<
  FlatListProps<ItemT>,
  | "data"
  | "renderItem"
  | "keyExtractor"
  | "contentContainerStyle"
  | "style"
  | "ListFooterComponent"
  | "ListHeaderComponent"
  | "ListEmptyComponent"
  | "onEndReached"
  | "onRefresh"
  | "refreshing"
>;

function defaultKeyExtractor(item: unknown, index: number) {
  return `${index}`;
}

function LongList<ItemT>({
  data,
  renderItem,
  keyExtractor = defaultKeyExtractor,
  contentContainerStyle,
  listStyle,
  isLoadingMore = false,
  loadingText = "Loading more…",
  loaderProps,
  ListHeaderComponent,
  ListEmptyComponent,
  footerComponent,
  onEndReached,
  onRefresh,
  refreshing,
  ...rest
}: LongListProps<ItemT>) {
  const renderFooter = useCallback(() => {
    const resolvedLoader = !isLoadingMore ? null : (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#6b7280" {...loaderProps} />
        {loadingText ? <Text style={styles.loadingText}>{loadingText}</Text> : null}
      </View>
    );

    const resolvedCustom = (() => {
      if (!footerComponent) {
        return null;
      }
      if (typeof footerComponent === "function") {
        const Footer = footerComponent;
        return <Footer />;
      }
      return footerComponent;
    })();

    if (!resolvedCustom && !resolvedLoader) {
      return null;
    }

    return (
      <>
        {resolvedCustom}
        {resolvedLoader}
      </>
    );
  }, [footerComponent, isLoadingMore, loaderProps, loadingText]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      style={listStyle}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={refreshing}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 32,
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#6b7280",
  },
});

export default LongList;
