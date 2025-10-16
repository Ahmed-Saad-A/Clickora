import React from "react";
import { Order } from "@/components/user";

export default function AllOrdersPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Order />
            </div>
        </div>
    );
}