"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Search,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Tag,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { CustomerLead } from "@/types/admin";

interface CustomersViewProps {
  customers: CustomerLead[];
  onAddCustomer: (lead: Omit<CustomerLead, "id" | "lastActive">) => Promise<void>;
}

export default function CustomersView({
  customers,
  onAddCustomer,
}: CustomersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [crafts, setCrafts] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = customers.filter((c) => {
    const query = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      (c.email || "").toLowerCase().includes(query) ||
      c.location.toLowerCase().includes(query) ||
      c.interestedCrafts.some((craft) => craft.toLowerCase().includes(query))
    );
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await onAddCustomer({
        name,
        email: email || undefined,
        phone: phone || undefined,
        location: location || "India",
        interestedCrafts: crafts
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        totalInquiries: 1,
        isVerifiedBuyer: true,
        notes: notes || undefined,
      });

      // Reset
      setName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setCrafts("");
      setNotes("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Add customer lead error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#D8D0C4] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
          <input
            type="text"
            placeholder="Search by buyer name, email, city, or craft interest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-xs text-[#1E211F] placeholder:text-[#68655F] focus:outline-none focus:border-[#B85C43]"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#B85C43] hover:bg-[#9E4730] text-white text-xs font-bold rounded-xl shadow-sm transition-colors w-full md:w-auto justify-center"
        >
          <PlusCircle className="size-4" />
          <span>Record New Buyer Lead</span>
        </button>
      </div>

      {/* Customer Leads CRM Table */}
      <div className="bg-white rounded-2xl border border-[#D8D0C4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#D8D0C4] text-[#68655F] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer / Buyer Lead</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">Craft Interests</th>
                <th className="px-6 py-4">Inquiries</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4 text-right">Channel Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EBE3D5]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#68655F]">
                    No customer leads match your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                    {/* Customer Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#1E211F] text-sm flex items-center gap-1.5">
                            {customer.name}
                            {customer.isVerifiedBuyer && (
                              <CheckCircle2 className="size-3.5 text-emerald-600" />
                            )}
                          </p>
                          {customer.notes && (
                            <p className="text-[11px] text-[#68655F] mt-0.5 line-clamp-1">
                              {customer.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-[#1E211F] font-medium">
                        <MapPin className="size-3.5 text-[#A88752]" />
                        {customer.location}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 space-y-1 text-[11px]">
                      {customer.email && (
                        <p className="flex items-center gap-1 text-[#68655F]">
                          <Mail className="size-3 text-[#68655F]" />
                          {customer.email}
                        </p>
                      )}
                      {customer.phone && (
                        <p className="flex items-center gap-1 font-mono text-[#1E211F]">
                          <Phone className="size-3 text-[#68655F]" />
                          {customer.phone}
                        </p>
                      )}
                    </td>

                    {/* Craft Interests */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {customer.interestedCrafts.map((craft, i) => (
                          <span
                            key={i}
                            className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#A88752]/15 text-[#A88752]"
                          >
                            {craft}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Inquiries Count */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#1E211F] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#D8D0C4]">
                        {customer.totalInquiries} inquiries
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-4 text-[#68655F] text-[11px]">
                      {new Date(customer.lastActive).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>

                    {/* Direct Contact Action */}
                    <td className="px-6 py-4 text-right">
                      {customer.phone ? (
                        <a
                          href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          <MessageCircle className="size-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#68655F]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F5F0E8] w-full max-w-lg rounded-2xl shadow-2xl border border-[#D8D0C4] p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
              <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
                Record Buyer Lead / Inquirer
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#68655F] hover:text-[#1E211F]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1E211F] mb-1">Customer / Curator Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-xl text-sm"
                  placeholder="e.g. Dr. Vikram Seth"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E211F] mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-xl text-sm"
                    placeholder="email@domain.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E211F] mb-1">WhatsApp / Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-xl text-sm"
                    placeholder="+91 98..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E211F] mb-1">City / State</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-xl text-sm"
                  placeholder="e.g. Hyderabad, Telangana"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E211F] mb-1">
                  Interested Crafts (comma separated)
                </label>
                <input
                  type="text"
                  value={crafts}
                  onChange={(e) => setCrafts(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-xl text-sm"
                  placeholder="e.g. Bidriware, Bamboo Basket, Terracotta"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E211F] mb-1">Curator / Buyer Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-xl text-sm"
                  placeholder="e.g. Looking for bulk festive corporate gifting order of 50 units."
                />
              </div>

              <div className="pt-3 border-t border-[#D8D0C4] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-[#68655F] hover:bg-[#EBE3D5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#B85C43] hover:bg-[#9E4730] text-white font-bold rounded-xl disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
