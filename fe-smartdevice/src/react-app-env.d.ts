/// <reference types="react-scripts" />
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "sockjs-client" {
  const SockJS: any;
  export default SockJS;
}
