import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import App from "./app";
import Users from '../features/users/user';
// import DemandForecadt from "../layout/demandforecast";
// import KTMPlan from "../layout/tkmPlan";
// import ItemMaster from "../layout/itemMaster";
// import SupplierMaster from "../layout/supplierMaster"; 
// import InventoryMaster from "../layout/inventoryMaster"; 
// import SupplierPlan from "../layout/supplierPlan";
// import InventoryMovement from "../layout/inventoryMovement";
// import Authorzation from "../authorzation";
// import ApprovalWorkFlow from "../approvalPlan";
// import SupplerKanbanPlan from "../layout/supplierKanbanPlan";
// import CreateTKMPlan from "../layout/createTkmPlan";
// import CreateSupplierPlan from "../layout/createSupplierPlan";
// import ProductionPlanList from "../layout/viewProductionPlanList";
// import CreateSupplierKanbanPlan from "../layout/createsupplierKanbanPlan";
// import ViewSupplierKanbanPlan from "../layout/viewSupplierKanbanplan";
// import Example from "../layout/expandRows";
// import Homes from "../layout/dashBoard";
// import ErrorPage from "../layout/notFound";
// import SupplierStockStatus from "../layout/supplierStockStatus";
// import SupplierDemandPlan from "../layout/supplierDemandPlan";
// import LineMaster from "../layout/lineMaster";
// import StockStatus from "../layout/stockStatus";
// import CreateCustomerDemandPlan from "../layout/createCustomerDemandPlan";
// import LoadCustomerPlan from "../layout/LoadCustomerPlan";
// import LoadSupplierPlan from "../layout/LoadSupplierPlan";
// import PlaninngEngine from "../components/PlaninngEngine";
// import PlanningLineChart from "../components/PlanLineChart";
// import KanbanError from "../components/KanbanError";
// import ProtectedRoute from "./ProtectedRoute";
// import FGDashboard from "../layout/FGDashboard";
// import KanbanLogin from "../layout/login";
// import RoughPlanning from "../layout/RoughPlanning";
// import SupplierPO from "../layout/SupplierPO";
// import AuditLog from "../layout/auditLog";
// import ForgotPassword from "../components/ForgotPassword";
// import WorkFlow from "../layout/workFlow";
// import RoleMaster from "../components/RoleMaster";
// import DepartmentMaster from "../components/Department";
// import SupplierDashboard from "../layout/SupplierDashboard";
// import EntiryMaster from "../layout/entity";
// import CreateBOM from "../layout/createBom";
// import SafetyStockCalculation from "../layout/safetyStockCal";
// import SupplierPlanAutomation from "../layout/supplierPlanAutomation";
// import InternalSupplierPlan from "../layout/internalSupplierPlan";
// import ShiftAllocationMaster from "../layout/shiftAllocationMaster";
// import ShiftCalcItem from "../layout/shiftCalcItem";
// import InternalSupplierStockStatus from "../layout/internalsupplierStockStatus";
// import RMPlaninngEngine from "../components/RmPlaninng";
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import LoginComponent from '../pages/Login';
import User from '../features/users/user';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Routes that share the main layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="/" element={<LoginComponent />} />
        <Route path="/app/user" element={<User />} />
      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
