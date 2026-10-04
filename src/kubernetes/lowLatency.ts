// A node is low-latency when either:
//  - its kernel is a dedicated lowlatency flavour (older Ubuntu: the kernel
//    name contains "lowlatency"), or
//  - it runs fully preemptive scheduling (preempt=full) on the kernel command
//    line. Ubuntu 26.04 dropped the separate kernel: `linux-lowlatency` is the
//    generic kernel plus the boot arguments `preempt=full rcu_nocbs=all`, so
//    `uname -r` still says "generic".
export function isLowLatencyNode(
  kernelVersion: string | undefined,
  kernelCommandLine: string | undefined,
): boolean {
  if (kernelVersion?.includes("lowlatency")) {
    return true;
  }

  return (kernelCommandLine ?? "").split(/\s+/).includes("preempt=full");
}
