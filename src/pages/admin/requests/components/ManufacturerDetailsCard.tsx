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
import { Manufacturer } from "../../../../constants/interface/admin/manufacturer";
import InfoField from "../../components/InfoField";

interface ManufacturerDetailsCardProps {
  manufacturer: Manufacturer;
}

const ManufacturerDetailsCard: React.FC<ManufacturerDetailsCardProps> = ({ manufacturer }) => {
  const navigate = useNavigate();
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span>Manufacturer Information</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate(`/admin/manufacturies/${manufacturer.id}`)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          <Badge variant={manufacturer.adminApprovalStatus === "APPROVED" ? "success" : "secondary"}>
            {manufacturer.adminApprovalStatus === "APPROVED" ? "Active" : manufacturer.adminApprovalStatus}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Factory Name" value={manufacturer.factoryName} />
          <InfoField label="Factory Type" value={manufacturer.factoryType} />
          <InfoField label="Email" value={manufacturer.email} />
          <InfoField label="Phone" value={manufacturer.phoneNumber} />
          <InfoField label="TIN Number" value={manufacturer.tinNumber} />
          <InfoField label="Registration Number" value={manufacturer.registrationNumber} />
          <InfoField label="License Number" value={manufacturer.licenseNumber} />
          <InfoField 
            label="License Expiry" 
            value={new Date(manufacturer.licenseExpiryDate).toLocaleDateString()} 
          />
          <InfoField label="Production Capacity" value={manufacturer.productionCapacity} />
          {manufacturer.website && (
            <InfoField label="Website" value={manufacturer.website} />
          )}
          {manufacturer.headOfficeAddress && (
            <InfoField
              label="Head Office Address"
              value={`${manufacturer.headOfficeAddress.street || ''}, ${manufacturer.headOfficeAddress.city}, ${manufacturer.headOfficeAddress.state}`}
            />
          )}
          <InfoField
            label="Joined Date"
            value={new Date(manufacturer.createdAt ?? "").toLocaleDateString()}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ManufacturerDetailsCard;