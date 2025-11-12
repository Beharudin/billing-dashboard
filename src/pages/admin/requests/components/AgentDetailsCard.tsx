import { ExternalLink } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../common/ui/card";
import { Agent } from "../../../../constants/interface/admin/agent";
import InfoField from "../../components/InfoField";

interface AgentDetailsCardProps {
  agent: Agent;
}

const AgentDetailsCard: React.FC<AgentDetailsCardProps> = ({ agent }) => {
  const navigate = useNavigate();
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span>Agent Information</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate(`/admin/agents/${agent.id}`)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          <Badge variant={agent.adminApprovalStatus ? "success" : "secondary"}>
            {agent.adminApprovalStatus ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Full Name" value={agent.fullName} />
          <InfoField label="Email" value={agent.email} />
          <InfoField label="Phone" value={agent.phoneNumber} />
          <InfoField label="Agent Type" value={agent.agentType} />
          <InfoField label="TIN" value={agent.taxIdentificationNumber} />
          <InfoField label="Credit Score" value={`${20.2}%`} />
          {agent.address && (
            <InfoField
              label="Address"
              value={`${agent.address.street}, ${agent.address.city}, ${agent.address.state}`}
            />
          )}
          <InfoField
            label="Joined Date"
            value={new Date(agent.createdAt ?? "").toLocaleDateString()}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentDetailsCard;
