import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Image, ImageProps, ImageStyle } from "expo-image";

export type PicsumSourceOptions = {
  width: number;
  height?: number;
  id?: string | number;
  seed?: string;
  grayscale?: boolean;
  blur?: number;
  random?: string | number | boolean;
  format?: "jpg" | "webp";
  query?: Record<string, string | number | boolean>;
};

type LazyImageProps = {
  source?: ImageProps["source"];
  picsum?: PicsumSourceOptions;
  alt?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  loaderSize?: "small" | "large";
  loaderColor?: string;
  placeholderContent?: React.ReactNode;
  fallbackContent?: React.ReactNode;
  transitionDuration?: number;
} & Omit<ImageProps, "source" | "style">;

const buildPicsumUrl = (options: PicsumSourceOptions) => {
  const {
    width,
    height,
    id,
    seed,
    grayscale,
    blur,
    random,
    format,
    query = {},
  } = options;

  const base = "https://picsum.photos";
  const pathSegments: string[] = [];

  if (id !== undefined) {
    pathSegments.push("id", encodeURIComponent(String(id)));
  } else if (seed !== undefined) {
    pathSegments.push("seed", encodeURIComponent(String(seed)));
  }

  pathSegments.push(String(width));
  if (height !== undefined) {
    pathSegments.push(String(height));
  }

  const extension = format ? `.${format}` : "";
  const path = `${pathSegments.map((segment) => `/${segment}`).join("")}${extension}`;

  const params: string[] = [];

  if (grayscale) {
    params.push("grayscale");
  }

  if (blur !== undefined) {
    const clampedBlur = Math.min(10, Math.max(1, Math.round(blur)));
    params.push(`blur=${clampedBlur}`);
  }

  if (random !== undefined) {
    const value = random === true ? Date.now() : random;
    params.push(`random=${encodeURIComponent(String(value))}`);
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) {
      return;
    }
    if (value === true) {
      params.push(encodeURIComponent(key));
      return;
    }
    params.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  });

  const queryString = params.length > 0 ? `?${params.join("&")}` : "";

  return `${base}${path}${queryString}`;
};

const LazyImage: React.FC<LazyImageProps> = ({
  source,
  picsum,
  alt,
  containerStyle,
  imageStyle,
  loaderSize = "small",
  loaderColor = "#6b7280",
  placeholderContent,
  fallbackContent,
  transitionDuration = 200,
  contentFit = "cover",
  ...rest
}) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    source || picsum ? "loading" : "error",
  );

  const resolvedSource = useMemo<ImageProps["source"] | null>(() => {
    if (picsum) {
      const url = buildPicsumUrl(picsum);
      return { uri: url };
    }
    return source ?? null;
  }, [picsum, source]);

  useEffect(() => {
    if (resolvedSource) {
      setStatus("loading");
    } else {
      setStatus("error");
    }
  }, [resolvedSource]);

  const transition = useMemo(
    () => ({ duration: transitionDuration }),
    [transitionDuration],
  );

  const renderPlaceholder = () => {
    if (placeholderContent) {
      return <View style={styles.placeholder}>{placeholderContent}</View>;
    }
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator size={loaderSize} color={loaderColor} />
      </View>
    );
  };

  const renderFallback = () => {
    if (fallbackContent) {
      return <View style={styles.placeholder}>{fallbackContent}</View>;
    }
    return (
      <View style={styles.placeholder}>
        <Text style={styles.fallbackText}>Image unavailable</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {status === "loading" && resolvedSource ? renderPlaceholder() : null}
      {status === "error" ? renderFallback() : null}
      {resolvedSource && status !== "error" ? (
        <Image
          accessibilityLabel={alt}
          source={resolvedSource}
          style={[styles.image, imageStyle]}
          contentFit={contentFit}
          transition={transition}
          onLoadStart={() => setStatus("loading")}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          {...rest}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(17, 24, 39, 0.05)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallbackText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default LazyImage;
