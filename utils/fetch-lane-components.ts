type Component = {
  id: string;
};

export type LaneData = {
  data: {
    lanes: {
      id: string;
      listComponents: Component[];
    };
  };
};

export async function fetchLaneComponents(
  laneId: string
): Promise<LaneData | undefined> {
  const query = `
  query LIST_LANE_COMPONENTS($id: String!, $namespace: String) {
    lanes {
      id
      listComponents(id: $id, namespace: $namespace) {
        id
        }
      }
    }
`;

  const variables = {
    id: laneId,
  };

  const token = process.env.BIT_CONFIG_ACCESS_TOKEN;
  if (!token) {
    throw new Error('BIT_CONFIG_ACCESS_TOKEN not found');
  }

  try {
    const response = await fetch('https://api.v2.bit.cloud/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    const data = await response.json();
    return data as LaneData;
  } catch (error) {
    console.error('Error:', error);
  }
}
