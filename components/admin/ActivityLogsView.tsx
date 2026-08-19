"use client";

import React, { useState } from "react";
import {
  Activity,
  Search,
  Filter,
  Download,
  Clock,
  Package,
  Users,
  MessageSquareCheck,
  Settings,
  Server,
} from "lucide-react";
import type { ActivityLog } from "@/types/admin";

interface ActivityLogsViewProps {
  logs: ActivityLog[];
}

export default function ActivityLogsView({ logs }: ActivityLogsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = logs.filter((log) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      log.details.toLowerCase().includes(query) ||
      log.actor.name.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query);

    const matchesType = typeFilter === "all" || log.entityType === typeFilter;

    return matchesSearch && matchesType;
  });

  const exportLogs = (format: "csv" | "json") => {
    if (format === "json") {
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
      const a = document.createElement("a");
      a.setAttribute("href", dataStr);
      a.setAttribute("download", `visart_audit_logs_${Date.now()}.json`);
      a.click();
    } else {
      const headers = "ID,Timestamp,Actor,Action,EntityType,EntityID,Details\n";
      const rows = logs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.actor.name}","${l.action}","${l.entityType}","${
              l.entityId
            }","${l.details.replace(/"/g, '""')}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visart_audit_logs_${Date.now()}.csv`;
      a.click();
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "product":
        return Package;
      case "artisan":
        return Users;
      case "review":
        return MessageSquareCheck;
      case "settings":
        return Settings;
      default:
        return Server;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D8D0C4] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-xs text-[#1E211F] placeholder:text-[#68655F] focus:outline-none focus:border-[#B85C43]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-xs text-[#1E211F] font-semibold focus:outline-none"
          >
            <option value="all">All Event Types ({logs.length})</option>
            <option value="product">Product Events</option>
            <option value="artisan">Artisan Events</option>
            <option value="review">Review Moderation</option>
            <option value="settings">Settings Changes</option>
            <option value="system">System Sync</option>
          </select>

          <button
            onClick={() => exportLogs("csv")}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#EBE3D5] text-[#1E211F] text-xs font-semibold rounded-xl border border-[#D8D0C4] transition-colors"
          >
            <Download className="size-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportLogs("json")}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#EBE3D5] text-[#1E211F] text-xs font-semibold rounded-xl border border-[#D8D0C4] transition-colors"
          >
            <Download className="size-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Activity Timeline Feed */}
      <div className="bg-white rounded-2xl border border-[#D8D0C4] shadow-sm p-6">
        <div className="divide-y divide-[#EBE3D5]">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#68655F]">
              No audit logs match your search.
            </p>
          ) : (
            filtered.map((log) => {
              const Icon = getEntityIcon(log.entityType);

              return (
                <div key={log.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="size-9 rounded-xl bg-[#F5F0E8] border border-[#D8D0C4] flex items-center justify-center text-[#B85C43] shrink-0 mt-0.5">
                      <Icon className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#1E211F]">{log.details}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#68655F]">
                        <span className="font-bold text-[#A88752]">{log.actor.name}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#D8D0C4] uppercase">
                          {log.action}
                        </span>
                        <span>•</span>
                        <span className="text-[11px]">Target: {log.entityId}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-[#68655F] shrink-0 flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {new Date(log.timestamp).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
