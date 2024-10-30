// components/agreements-list.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import { useContract } from "@/hooks/use-contract";
import { useWallet } from "@/hooks/use-wallet";
import { Agreement } from "@/types/agreement";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

const STATUS_BADGES = {
  1: { label: "Pending", variant: "warning" },
  2: { label: "Funded", variant: "info" },
  3: { label: "Accepted", variant: "success" },
  4: { label: "Completed", variant: "success" },
  5: { label: "Disputed", variant: "destructive" },
  6: { label: "Refunded", variant: "secondary" },
} as const;

export const AgreementsList = () => {
  const { address } = useWallet();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{
    field: keyof Agreement;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });

  const {
    agreements,
    loading,
    error,
    fundAgreement,
    acceptAgreement,
    completeAgreement,
    disputeAgreement,
  } = useContract(address || "");

  // Filter agreements
  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      search === "" ||
      agreement.description.toLowerCase().includes(search.toLowerCase()) ||
      agreement.id.toString().includes(search) ||
      agreement.buyer.toLowerCase().includes(search.toLowerCase()) ||
      agreement.vendor.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "created" && agreement.vendor === address) ||
      (filter === "received" && agreement.buyer === address);

    return matchesSearch && matchesFilter;
  });

  // Sort agreements
  const sortedAgreements = [...filteredAgreements].sort((a, b) => {
    const factor = sort.direction === "asc" ? 1 : -1;
    if (a[sort.field] < b[sort.field]) return -1 * factor;
    if (a[sort.field] > b[sort.field]) return 1 * factor;
    return 0;
  });

  // Paginate agreements
  const totalPages = Math.ceil(sortedAgreements.length / ITEMS_PER_PAGE);
  const paginatedAgreements = sortedAgreements.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleAction = async (action: string, agreementId: number) => {
    try {
      switch (action) {
        case "fund":
          await fundAgreement(agreementId);
          break;
        case "accept":
          await acceptAgreement(agreementId);
          break;
        case "complete":
          await completeAgreement(agreementId);
          break;
        case "dispute":
          await disputeAgreement(agreementId);
          break;
      }
      toast({
        title: "Success",
        description: `Agreement ${action} successful`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${action} agreement: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-3xl font-bold text-center">Connect Your Wallet</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Connect your Stacks wallet to view your agreements
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agreements</h1>
        <Link href="/agreements/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Agreement
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agreements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agreements</SelectItem>
            <SelectItem value="created">Created by me</SelectItem>
            <SelectItem value="received">Received by me</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">{error}</div>
      ) : paginatedAgreements.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No agreements found
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount (STX)</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAgreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell>{agreement.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {agreement.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGES[agreement.status].variant}>
                        {STATUS_BADGES[agreement.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{agreement.amount}</TableCell>
                    <TableCell className="max-w-[120px] truncate">
                      {agreement.vendor === address ? "You" : agreement.vendor}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate">
                      {agreement.buyer === address ? "You" : agreement.buyer}
                    </TableCell>
                    <TableCell>
                      {new Date(agreement.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/agreements/${agreement.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {agreement.status === 1 &&
                            agreement.buyer === address && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAction("fund", agreement.id)
                                }
                              >
                                Fund Agreement
                              </DropdownMenuItem>
                            )}
                          {agreement.status === 2 &&
                            agreement.buyer === address && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAction("accept", agreement.id)
                                }
                              >
                                Accept Agreement
                              </DropdownMenuItem>
                            )}
                          {agreement.status === 3 &&
                            agreement.buyer === address && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction("complete", agreement.id)
                                  }
                                >
                                  Complete Agreement
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction("dispute", agreement.id)
                                  }
                                >
                                  Dispute Agreement
                                </DropdownMenuItem>
                              </>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                      className="w-8"
                    >
                      {pageNum}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
