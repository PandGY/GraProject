// 告诉 TypeScript window 对象上有一个 Buffer 属性，其类型是 typeof Buffer
interface Window {
  Buffer: typeof Buffer;
}