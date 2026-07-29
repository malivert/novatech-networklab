"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useMemo } from "react";
import { networkDevices } from "@/data/network";
import type { NetworkDevice, Scenario } from "@/types/network";

interface NetworkTopologyProps {
  scenario: Scenario;
  corrected: boolean;
  selectedDeviceId: string;
  onSelectDevice: (device: NetworkDevice) => void;
}

const positions: Record<string, { x: number; y: number }> = {
  internet: { x: 410, y: 10 },
  "fw-01": { x: 410, y: 120 },
  "rtr-01": { x: 410, y: 230 },
  "sw-core": { x: 410, y: 350 },
  "srv-infra": { x: 140, y: 510 },
  "srv-files": { x: 330, y: 510 },
  "ap-01": { x: 520, y: 510 },
  "pc-dir": { x: 20, y: 660 },
  "pc-cpta": { x: 220, y: 660 },
  "pc-com": { x: 420, y: 660 },
  "pc-it": { x: 620, y: 660 },
};

const edgePairs = [
  ["internet", "fw-01"],
  ["fw-01", "rtr-01"],
  ["rtr-01", "sw-core"],
  ["sw-core", "srv-infra"],
  ["sw-core", "srv-files"],
  ["sw-core", "ap-01"],
  ["sw-core", "pc-dir"],
  ["sw-core", "pc-cpta"],
  ["sw-core", "pc-com"],
  ["sw-core", "pc-it"],
];

export function NetworkTopology({
  scenario,
  corrected,
  selectedDeviceId,
  onSelectDevice,
}: NetworkTopologyProps) {
  const nodes = useMemo<Node[]>(() => {
    return networkDevices.map((device) => {
      const affected = !corrected && scenario.affectedDeviceIds.includes(device.id);
      const selected = selectedDeviceId === device.id;
      return {
        id: device.id,
        position: positions[device.id],
        data: {
          label: (
            <div className="topology-node-content">
              <span className={`node-led ${affected ? "degraded" : device.status}`} />
              <strong>{device.name}</strong>
              <small>{device.type}</small>
              <span>{device.ip}</span>
            </div>
          ),
        },
        className: `topology-node ${affected ? "affected" : ""} ${selected ? "selected" : ""}`,
      };
    });
  }, [corrected, scenario, selectedDeviceId]);

  const edges = useMemo<Edge[]>(
    () =>
      edgePairs.map(([source, target], index) => {
        const affected =
          !corrected &&
          (scenario.packetStopDeviceId === source || scenario.packetStopDeviceId === target);
        return {
          id: `edge-${index}`,
          source,
          target,
          animated: !affected,
          style: {
            stroke: affected ? "#f59e0b" : "#42556f",
            strokeWidth: affected ? 3 : 1.5,
          },
        };
      }),
    [corrected, scenario.packetStopDeviceId],
  );

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const device = networkDevices.find((item) => item.id === node.id);
    if (device) onSelectDevice(device);
  };

  return (
    <div className="topology-canvas" aria-label="Topologie réseau interactive NovaTech">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        nodesConnectable={false}
        deleteKeyCode={null}
        fitView
        minZoom={0.55}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) =>
            scenario.affectedDeviceIds.includes(node.id) && !corrected ? "#f59e0b" : "#2563eb"
          }
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

