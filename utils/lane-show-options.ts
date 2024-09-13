import type { LaneDetails } from '../types/lane-details';

let compsInLaneJson = '';

export const laneShowOptions = (
  wsDir: string,
  compsInLaneObj: LaneDetails
) => ({
  cwd: wsDir,
  listeners: {
    stdout: (data: Buffer) => {
      compsInLaneJson = data.toString();
      compsInLaneObj = JSON.parse(compsInLaneJson);
    },
  },
});
