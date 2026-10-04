import { isLowLatencyNode } from "./lowLatency";

describe("isLowLatencyNode", () => {
  const ubuntu2604Cmdline =
    "BOOT_IMAGE=/vmlinuz-7.0.0-38-generic root=UUID=x ro net.ifnames=0 console=tty0 preempt=full rcu_nocbs=all crashkernel=2G-4G:320M";

  it("recognises a dedicated lowlatency kernel by its name (older Ubuntu)", () => {
    expect(isLowLatencyNode("6.8.0-45-lowlatency", "BOOT_IMAGE=/vmlinuz ro quiet")).toBe(true);
  });

  it("recognises Ubuntu 26.04 low latency: generic kernel with preempt=full", () => {
    expect(isLowLatencyNode("7.0.0-38-generic", ubuntu2604Cmdline)).toBe(true);
  });

  it("is not low latency for a plain generic kernel", () => {
    expect(
      isLowLatencyNode("7.0.0-38-generic", "BOOT_IMAGE=/vmlinuz-7.0.0-38-generic ro net.ifnames=0 console=tty0"),
    ).toBe(false);
  });

  it("does not treat lazy or voluntary preemption as low latency", () => {
    expect(isLowLatencyNode("7.0.0-38-generic", "ro preempt=lazy")).toBe(false);
    expect(isLowLatencyNode("7.0.0-38-generic", "ro preempt=voluntary")).toBe(false);
  });

  it("matches the whole argument, not a substring", () => {
    expect(isLowLatencyNode("7.0.0-38-generic", "ro mypreempt=full")).toBe(false);
    expect(isLowLatencyNode("7.0.0-38-generic", "ro preempt=full2")).toBe(false);
  });

  it("falls back to the kernel name when the command line is unreadable", () => {
    expect(isLowLatencyNode("7.0.0-38-generic", undefined)).toBe(false);
    expect(isLowLatencyNode("6.8.0-45-lowlatency", undefined)).toBe(true);
    expect(isLowLatencyNode(undefined, undefined)).toBe(false);
  });
});
