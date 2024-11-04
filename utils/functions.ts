export const getBoundingBox = (points: [number, number][]) => {
  console.log(points);
  return points.reduce<{
    ne: (typeof points)[number];
    sw: (typeof points)[number];
  }>(
    (acc, curr) => ({
      ne: [Math.max(acc.ne[0], curr[0]), Math.max(acc.ne[1], curr[1])],
      sw: [Math.min(acc.ne[0], curr[0]), Math.min(acc.ne[1], curr[1])],
    }),
    {
      ne: points[0],
      sw: points[0],
    },
  );
};
