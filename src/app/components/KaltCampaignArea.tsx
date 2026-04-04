"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { CampaignWizard } from "./CampaignWizard";
import { KaltEmailSection } from "./sections/KaltEmailSection";
import { Button } from "./Button";
import { Card } from "./Card";
import { deleteCampaign, laodCampaigns, type Campaign } from "@/lib/scribeLocalStorage";

type Tab = "g"