import React, { useMemo } from "react";
import Mapbox from "@rnmapbox/maps";
import type { Feature, Point } from "geojson";
import headingIcon from "@rnmapbox/maps/lib/module/assets/heading.png";

type Props = {
  coordinate: [number, number] | null;
  heading: number | null;
  visible?: boolean;
  showsHeadingIndicator?: boolean;
};

const mapboxBlue = "rgba(51, 181, 229, 100)";

const sharedCircleStyle = {
  circlePitchAlignment: "map" as const,
  circleEmissiveStrength: 1,
};

const layerStyles = {
  pulse: {
    ...sharedCircleStyle,
    circleRadius: 15,
    circleColor: mapboxBlue,
    circleOpacity: 0.2,
  },
  background: {
    ...sharedCircleStyle,
    circleRadius: 9,
    circleColor: "#ffffff",
  },
  foreground: {
    ...sharedCircleStyle,
    circleRadius: 6,
    circleColor: mapboxBlue,
  },
};

const headingIndicatorStyle = {
  iconImage: "userLocationHeading",
  iconAllowOverlap: true,
  iconPitchAlignment: "map" as const,
  iconRotationAlignment: "map" as const,
};

const CustomUserLocationIndicator = ({
  coordinate,
  heading,
  visible = true,
  showsHeadingIndicator = false,
}: Props) => {
  const shape = useMemo<Feature<Point> | null>(() => {
    if (!coordinate) return null;

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coordinate,
      },
      properties: {},
    };
  }, [coordinate]);

  const shouldRenderHeading =
    showsHeadingIndicator &&
    typeof heading === "number" &&
    Number.isFinite(heading) &&
    heading >= 0;

  if (!visible || !shape) return null;

  return (
    <>
      {shouldRenderHeading && (
        <Mapbox.Images images={{ userLocationHeading: headingIcon }} />
      )}
      <Mapbox.ShapeSource id="custom-user-location-source" shape={shape}>
        <Mapbox.CircleLayer
          id="custom-user-location-pulse"
          style={layerStyles.pulse}
        />
        <Mapbox.CircleLayer
          id="custom-user-location-background"
          style={layerStyles.background}
        />
        <Mapbox.CircleLayer
          id="custom-user-location-foreground"
          aboveLayerID="custom-user-location-background"
          style={layerStyles.foreground}
        />
        {shouldRenderHeading && (
          <Mapbox.SymbolLayer
            id="custom-user-location-heading"
            aboveLayerID="custom-user-location-foreground"
            style={{
              ...headingIndicatorStyle,
              iconRotate: heading,
            }}
          />
        )}
      </Mapbox.ShapeSource>
    </>
  );
};

export default CustomUserLocationIndicator;

