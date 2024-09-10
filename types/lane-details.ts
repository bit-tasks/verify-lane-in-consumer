interface Component {
  id: string;
  head: string;
}

interface ID {
  name: string;
  scope: string;
}

export interface LaneDetails {
  id: ID;
  components: Component[];
}
