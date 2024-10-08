type Component = {
  id: string;
};

type LaneData = {
  id: string;
  listComponents: Component[];
};

export type LanesResponse = {
  data: {
    lanes: LaneData;
  };
  error?: {
    message: string;
    code?: number;
  };
};
