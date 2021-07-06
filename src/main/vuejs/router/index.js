import Vue from 'vue'
import Router from 'vue-router'
const Layout = resolve => require(['@/components/Layout'], resolve)
// const Home = resolve => require(['@/pages/home'], resolve)
const HomePage = resolve => require(['@/pages/home/homePage'], resolve)
// 业务-我的
const MyTask = resolve => require(['@/pages/my/task/MyTask'], resolve)
const CreateTask = resolve => require(['@/pages/my/task/CreateTask'], resolve)

const AddCustomsclearance = resolve => require(['@/pages/my/task/AddCustomsclearance'], resolve)
const TaskDetail = resolve => require(['@/pages/my/task/TaskDetail'], resolve)
const BaoGuanTaskCommit = resolve => require(['@/pages/my/task/BaoGuanTaskCommit'], resolve)
const OutSideTaskCommit = resolve => require(['@/pages/my/task/OutSideTaskCommit'], resolve)

const MyAudit = resolve => require(['@/pages/my/MyAudit'], resolve)
const MyAuditAdministration = resolve => require(['@/pages/my/MyAuditAdministration'], resolve)
const MyApply = resolve => require(['@/pages/my/MyApply'], resolve)
const MyApplyAdministration = resolve => require(['@/pages/my/MyApplyAdministration'], resolve)
const MyProject = resolve => require(['@/pages/my/project/MyProject'], resolve)
// const MyAirProject = resolve => require(['@/pages/my/project/MyAirProject'], resolve)
// const MyArtProject = resolve => require(['@/pages/my/project/MyArtProject'], resolve)
const AddProject = resolve => require(['@/pages/my/project/AddProject'], resolve)
const AddDfgProject = resolve => require(['@/pages/my/project/AddDfgProject'], resolve)
const AddAirProject = resolve => require(['@/pages/my/project/AddAirProject'], resolve)
const ProjectDetail = resolve => require(['@/pages/my/project/ProjectDetail'], resolve)
const ProjectOfferPreview = resolve => require(['@/pages/my/project/ProjectOfferPreview'], resolve)
const ProjectCargoInfo = resolve => require(['@/pages/my/project/ProjectCargoInfo'], resolve)
const ProjectIntercourseAccount = resolve => require(['@/pages/my/project/ProjectIntercourseAccount'], resolve)

// 业务-仓储管理
const AddNobonded = resolve => require(['@/pages/storage/AddNobonded'], resolve)
const NonBondedStorageList = resolve => require(['@/pages/storage/NonBondedStorageList'], resolve)
const ReceiptResultList = resolve => require(['@/pages/storage/ReceiptResultList'], resolve)

const StorageTask = resolve => require(['@/pages/storage/StorageTask'], resolve)
const StorageList = resolve => require(['@/pages/storage/StorageList'], resolve)
const OperationLog = resolve => require(['@/pages/storage/OperationLog'], resolve)
const AddStorageIn = resolve => require(['@/pages/storage/AddStorageIn'], resolve)
const AddStorageOut = resolve => require(['@/pages/storage/AddStorageOut'], resolve)
const StockIn = resolve => require(['@/pages/storage/StockIn'], resolve)
const StockOut = resolve => require(['@/pages/storage/StockOut'], resolve)
const StockInOutAudit = resolve => require(['@/pages/storage/StockInOutAudit'], resolve)

const OutboundDetails = resolve => require(['@/pages/storage/OutboundDetails'], resolve)

// 业务-项目管理
const ProjectList = resolve => require(['@/pages/projectmanage/ProjectList'], resolve)
const AirMaterialList = resolve => require(['@/pages/projectmanage/AirMaterialList'], resolve)
const ArtworkList = resolve => require(['@/pages/projectmanage/ArtworkList'], resolve)
const MuseumList = resolve => require(['@/pages/projectmanage/MuseumList'], resolve)
const AuctionList = resolve => require(['@/pages/projectmanage/AuctionList'], resolve)
const ArtDfgList = resolve => require(['@/pages/projectmanage/ArtDfgList'], resolve)

// 业务-任务管理
const Tasklist = resolve => require(['@/pages/taskmanage/Tasklist'], resolve)
const CustomsManage = resolve => require(['@/pages/taskmanage/CustomsManage'], resolve)
const DfgCustomsManage = resolve => require(['@/pages/taskmanage/DfgCustomsManage'], resolve)
const AddCustoms = resolve => require(['@/pages/taskmanage/AddCustoms'], resolve)
const AddDfgCustoms = resolve => require(['@/pages/taskmanage/AddDfgCustoms'], resolve)

// 业务-车辆管理
const CarList = resolve => require(['@/pages/carmanage/CarList'], resolve)
const CarAdminList = resolve => require(['@/pages/carmanage/CarAdminList'], resolve)
const CarAerialList = resolve => require(['@/pages/carmanage/CarAerialList'], resolve)
const CarCustomsList = resolve => require(['@/pages/carmanage/CarCustomsList'], resolve)
const CarGoodsList = resolve => require(['@/pages/carmanage/CarGoodsList'], resolve)
const OilCard = resolve => require(['@/pages/carmanage/OilCard'], resolve)
const ETC = resolve => require(['@/pages/carmanage/ETC'], resolve)
const CarFinance = resolve => require(['@/pages/carmanage/Finance'], resolve)
const AddCar = resolve => require(['@/pages/carmanage/AddCar'], resolve)
const CarDetail = resolve => require(['@/pages/carmanage/CarDetail'], resolve)
const TransportCarInfo = resolve => require(['@/pages/carmanage/TransportCarInfo'], resolve)
const MaintenanceInfo = resolve => require(['@/pages/carmanage/MaintenanceInfo'], resolve)
const InsuranceRecord = resolve => require(['@/pages/carmanage/InsuranceRecord'], resolve)
const RegulationRecord = resolve => require(['@/pages/carmanage/RegulationRecord'], resolve)
const AboutProject = resolve => require(['@/pages/carmanage/AboutProject'], resolve)
const IntendInspect = resolve => require(['@/pages/carmanage/IntendInspect'], resolve)
const AddIntendInspect = resolve => require(['@/pages/carmanage/AddIntendInspect'], resolve)
const SelectIntendInspect = resolve => require(['@/pages/carmanage/AddIntendInspect'], resolve)
const CarInspect = resolve => require(['@/pages/carmanage/CarInspect'], resolve)
const AddCarInspect = resolve => require(['@/pages/carmanage/AddCarInspect'], resolve)
const FileManage = resolve => require(['@/pages/carmanage/FileManage'], resolve)
const CarMonitor = resolve => require(['@/pages/carmanage/CarMonitor'], resolve)
const CarTracking = resolve => require(['@/pages/carmanage/CarTracking'], resolve)
const CarGpsList = resolve => require(['@/pages/carmanage/CarGpsList'], resolve)
// 业务-投标管理
const BiddingList = resolve => require(['@/pages/biddingmanage/BiddingList'], resolve)
const AerialBiddingList = resolve => require(['@/pages/biddingmanage/BiddingList2'], resolve)
const DutyFreeBiddingList = resolve => require(['@/pages/biddingmanage/BiddingList3'], resolve)
const AddBidProject = resolve => require(['@/pages/my/project/AddBidProject'], resolve)
const EditNewBiddingPro = resolve => require(['@/pages/biddingmanage/AddNewBiddingPro'], resolve)
const BidProjectSurvey = resolve => require(['@/pages/biddingmanage/BidProjectSurvey'], resolve)
const BiddingDetail = resolve => require(['@/pages/biddingmanage/BiddingDetail'], resolve)
const SeniorityInfo = resolve => require(['@/pages/biddingmanage/SeniorityInfo'], resolve)
const BidSignUp = resolve => require(['@/pages/biddingmanage/BidSignUp'], resolve)
const Contacts = resolve => require(['@/pages/biddingmanage/Contacts'], resolve)
const IntercourseAccount = resolve => require(['@/pages/biddingmanage/IntercourseAccount'], resolve)
const BidFileManage = resolve => require(['@/pages/biddingmanage/BidFileManage'], resolve)
const Feedback = resolve => require(['@/pages/biddingmanage/Feedback'], resolve)
const ResultTracking = resolve => require(['@/pages/biddingmanage/ResultTracking'], resolve)
const PrintList = resolve => require(['@/pages/biddingmanage/PrintList'], resolve)
const FileMake = resolve => require(['@/pages/biddingmanage/FileMake'], resolve)
const BidQuestion = resolve => require(['@/pages/biddingmanage/Question'], resolve)
const BidAttention = resolve => require(['@/pages/biddingmanage/Attention'], resolve)
const BiddingDocumentList = resolve => require(['@/pages/biddingmanage/BiddingDocumentList'], resolve)
const BidProjectFinance = resolve => require(['@/pages/biddingmanage/ProjectFinance'], resolve)

// 业务-异常管理
const ExceptionList = resolve => require(['@/pages/exceptionmanage/ExceptionList'], resolve)
const ExceptionDetail = resolve => require(['@/pages/exceptionmanage/ExceptionDetail'], resolve)
const ExSituationDesc = resolve => require(['@/pages/exceptionmanage/ExSituationDesc'], resolve)
const ExDealResult = resolve => require(['@/pages/exceptionmanage/ExDealResult'], resolve)
const ExFileManage = resolve => require(['@/pages/exceptionmanage/ExFileManage'], resolve)



//业务-客户走访




// 财务管理-合同管理
const ContractsList = resolve => require(['@/pages/financemanage/contracts/ContractsList'], resolve)
const AddContracts = resolve => require(['@/pages/financemanage/contracts/AddContracts'], resolve)
const ContractsDetails = resolve => require(['@/pages/financemanage/contracts/ContractsDetails'], resolve)
const AerialContractsList = resolve => require(['@/pages/financemanage/contracts/AerialContractsList'], resolve)
const AerialAddContracts = resolve => require(['@/pages/financemanage/contracts/AddContracts2'], resolve)
const AerialContractsDetails = resolve => require(['@/pages/financemanage/contracts/ContractsDetails2'], resolve)
const GoodsContractsList = resolve => require(['@/pages/financemanage/contracts/GoodsContractsList'], resolve)
const GoodsAddContracts = resolve => require(['@/pages/financemanage/contracts/AddContracts3'], resolve)
const GoodsContractsDetails = resolve => require(['@/pages/financemanage/contracts/ContractsDetails3'], resolve)
const AdminContractsList = resolve => require(['@/pages/financemanage/contracts/AdminContractsList'], resolve)
const AddAdminContracts = resolve => require(['@/pages/financemanage/contracts/AddAdminContracts'], resolve)
const AdminContractsDetails = resolve => require(['@/pages/financemanage/contracts/AdminContractsDetails'], resolve)
const AuctionContractsList = resolve => require(['@/pages/financemanage/contracts/AuctionContractsList'], resolve)
const MuseumContractsList = resolve => require(['@/pages/financemanage/contracts/MuseumContractsList'], resolve)

// 财务管理-发票管理
const InvoiceList = resolve => require(['@/pages/financemanage/invoice/InvoiceList'], resolve)
const InvoiceDetail = resolve => require(['@/pages/financemanage/invoice/InvoiceDetail'], resolve)
const InvoiceApply = resolve => require(['@/pages/financemanage/invoice/InvoiceApply'], resolve)
const InvoiceApplyEdit = resolve => require(['@/pages/financemanage/invoice/InvoiceApplyEdit'], resolve)
const AccountAdvance = resolve => require(['@/pages/financemanage/invoice/AccountAdvance'], resolve)
const AccountAdvanceEdit = resolve => require(['@/pages/financemanage/invoice/AccountAdvanceEdit'], resolve)

// 财务管理-付款管理
const PaymentList = resolve => require(['@/pages/financemanage/payment/PaymentList'], resolve)
const PaymentApply = resolve => require(['@/pages/financemanage/payment/PaymentApply'], resolve)
const PaymentApplyEdit = resolve => require(['@/pages/financemanage/payment/PaymentApplyEdit'], resolve)
const PaymentDetail = resolve => require(['@/pages/financemanage/payment/PaymentDetail'], resolve)
const PaymentAuditDetail = resolve => require(['@/pages/financemanage/payment/PaymentAuditDetail'], resolve)

// 免税品
const GoodsWarehouse = resolve => require(['@/pages/dutyfreegoods/GoodsWarehouse'], resolve)
const TransportationManagement = resolve => require(['@/pages/dutyfreegoods/TransportationManagement'], resolve)
const AerTransportationManagement = resolve => require(['@/pages/dutyfreegoods/TransportationManagement2'], resolve)
const ArtTransportationManagement = resolve => require(['@/pages/dutyfreegoods/TransportationManagement3'], resolve)
// 财务管理-借款管理
const BorrowList = resolve => require(['@/pages/financemanage/borrow/BorrowList'], resolve)
const BorrowApply = resolve => require(['@/pages/financemanage/borrow/BorrowApply'], resolve)
const BorrowApplyEdit = resolve => require(['@/pages/financemanage/borrow/BorrowApplyEdit'], resolve)
const BorrowDetail = resolve => require(['@/pages/financemanage/borrow/BorrowDetail'], resolve)
const BorrowAuditDetail = resolve => require(['@/pages/financemanage/borrow/BorrowAuditDetail'], resolve)
// 财务管理-行政管理
const AdministrationList = resolve => require(['@/pages/financemanage/administration/AdministrationList'], resolve)
const AdministrationApply = resolve => require(['@/pages/financemanage/administration/AdministrationApply'], resolve)
const AdministrationApplyEdit = resolve => require(['@/pages/financemanage/administration/AdministrationApplyEdit'], resolve)
const AdministrationDetail = resolve => require(['@/pages/financemanage/administration/AdministrationDetail'], resolve)
const AdministrationAuditDetail = resolve => require(['@/pages/financemanage/administration/AdministrationAuditDetail'], resolve)
// 财务管理-报销管理
const ReimburseList = resolve => require(['@/pages/financemanage/reimburse/ReimburseList'], resolve)
const ReimburseApply = resolve => require(['@/pages/financemanage/reimburse/ReimburseApply'], resolve)
const ReimburseApplyEdit = resolve => require(['@/pages/financemanage/reimburse/ReimburseApplyEdit'], resolve)
const ReimburseDetail = resolve => require(['@/pages/financemanage/reimburse/ReimburseDetail'], resolve)
const ReimburseAuditDetail = resolve => require(['@/pages/financemanage/reimburse/ReimburseAuditDetail'], resolve)

// 财务管理-进账管理
const IncomeList = resolve => require(['@/pages/financemanage/incomemanage/IncomeList'], resolve)
const AddIncome = resolve => require(['@/pages/financemanage/incomemanage/AddIncome'], resolve)
// 财务管理-差旅管理
const TravelManagement = resolve => require(['@/pages/financemanage/travel/TravelManagement'], resolve)
const TravelApply = resolve => require(['@/pages/financemanage/travel/TravelApply'], resolve)
const TravelApplyEdit = resolve => require(['@/pages/financemanage/travel/TravelApplyEdit'], resolve)
const TravelDetails = resolve => require(['@/pages/financemanage/travel/TravelDetails'], resolve)
const TravelApproval = resolve => require(['@/pages/financemanage/travel/TravelApproval'], resolve)

// 统计-统计管理
const ProjectProfit = resolve => require(['@/pages/statisticsmanage/ProjectProfit'], resolve)
const CompanyProfit = resolve => require(['@/pages/statisticsmanage/CompanyProfit'], resolve)
const DepartmentProfit = resolve => require(['@/pages/statisticsmanage/DepartmentProfit'], resolve)
const PersonProfit = resolve => require(['@/pages/statisticsmanage/PersonProfit'], resolve)
const AerialMaterialList = resolve => require(['@/pages/statisticsmanage/AerialMaterialList'], resolve)
const AddAerialMaterial = resolve => require(['@/pages/statisticsmanage/AddAerialMaterial'], resolve)
const BreakEvenAnalysis = resolve => require(['@/pages/statisticsmanage/BreakEvenAnalysis'], resolve)
const ProjectBreakEven = resolve => require(['@/pages/statisticsmanage/ProjectBreakEven'], resolve)
const ProjectBreakEvenDetails = resolve => require(['@/pages/statisticsmanage/ProjectBreakEvenDetails'], resolve)
const ProjectFinanceDetails = resolve => require(['@/pages/my/project/ProjectFinanceDetails'], resolve)
const CustomerStatistics = resolve => require(['@/pages/statisticsmanage/CustomerStatistics'], resolve)
const SupplierStatistics = resolve => require(['@/pages/statisticsmanage/SupplierStatistics'], resolve)

// 资源-文件管理
const FileStructure = resolve => require(['@/pages/resource/filemanage/FileStructure'], resolve)
const FileList = resolve => require(['@/pages/resource/filemanage/FileList'], resolve)
const ProjectFile = resolve => require(['@/pages/resource/filemanage/ProjectFile'], resolve)

// 资源-战略合作伙伴管理
const PartnerList = resolve => require(['@/pages/resource/partnermanage/PartnerList'], resolve)
const AddPartner = resolve => require(['@/pages/resource/partnermanage/AddPartner'], resolve)
const PartnerDetail = resolve => require(['@/pages/resource/partnermanage/PartnerDetail'], resolve)

// 资源-客户管理
const CustomerList = resolve => require(['@/pages/resource/customermanage/CustomerList'], resolve)
const AddCustomer = resolve => require(['@/pages/resource/customermanage/AddCustomer'], resolve)
const CustomerDetail = resolve => require(['@/pages/resource/customermanage/CustomerDetail'], resolve)
const GoodsCustomerList = resolve => require(['@/pages/resource/customermanage/CustomerList2'], resolve)
const GoodsAddCustomer = resolve => require(['@/pages/resource/customermanage/AddCustomer2'], resolve)
const GoodsCustomerDetail = resolve => require(['@/pages/resource/customermanage/CustomerDetail2'], resolve)
const AerialCustomerList = resolve => require(['@/pages/resource/customermanage/CustomerList3'], resolve)
const AerialAddCustomer = resolve => require(['@/pages/resource/customermanage/AddCustomer3'], resolve)
const AerialCustomerDetail = resolve => require(['@/pages/resource/customermanage/CustomerDetail3'], resolve)
const ContemCustomerList = resolve => require(['@/pages/resource/customermanage/CustomerList4'], resolve)
const GalleryCustomerList = resolve => require(['@/pages/resource/customermanage/CustomerList5'], resolve)

// 资源-供应商管理
const SupplierList = resolve => require(['@/pages/resource/suppliermanage/SupplierList'], resolve)
const AerialSupplierList = resolve => require(['@/pages/resource/suppliermanage/SupplierList2'], resolve)
const GoodsSupplierList = resolve => require(['@/pages/resource/suppliermanage/SupplierList3'], resolve)
const AddOuterWorkerSupplier = resolve => require(['@/pages/resource/suppliermanage/outerWorker/AddOuterWorkerSupplier'], resolve)
const SupplierOuterWorkerDetails = resolve => require(['@/pages/resource/suppliermanage/outerWorker/SupplierOuterWorkerDetails'], resolve)
const SupplierOuterWorkerList = resolve => require(['@/pages/resource/suppliermanage/outerWorker/SupplierOuterWorkerList'], resolve)
const OuterWorkerPastExperience = resolve => require(['@/pages/resource/suppliermanage/outerWorker/PastExperience'], resolve)


const OuterWorkerSeniorityInfo = resolve => require(['@/pages/resource/suppliermanage/outerWorker/SeniorityInfo'], resolve)
const OuterWorkerContacts = resolve => require(['@/pages/resource/suppliermanage/outerWorker/Contacts'], resolve)
const OuterWorkerFileManage = resolve => require(['@/pages/resource/suppliermanage/outerWorker/FileManage'], resolve)
const OuterWorkerSkills = resolve => require(['@/pages/resource/suppliermanage/outerWorker/Skills'], resolve)
// const SupplierServiceInfo = resolve => require(['@/pages/resource/suppliermanage/outerWorker/SupplierServiceInfo'], resolve)


const SupplierAdministrationList = resolve => require(['@/pages/resource/suppliermanage/SupplierAdministrationList'], resolve)
const SupplierMaterielList = resolve => require(['@/pages/resource/suppliermanage/SupplierMaterielList'], resolve)
const MaterielSupplierAdd = resolve => require(['@/pages/resource/suppliermanage/MaterielSupplierAdd'], resolve)
const MaterielSupplierEdit = resolve => require(['@/pages/resource/suppliermanage/MaterielSupplierEdit'], resolve)

const AddSupplier = resolve => require(['@/pages/resource/suppliermanage/AddSupplier'], resolve)
const SupplierDetail = resolve => require(['@/pages/resource/suppliermanage/SupplierDetail'], resolve)
const SupplierSeniorityInfo = resolve => require(['@/pages/resource/suppliermanage/SupplierSeniorityInfo'], resolve)
const Contract = resolve => require(['@/pages/resource/suppliermanage/Contract'], resolve)
const SupplierFileManage = resolve => require(['@/pages/resource/suppliermanage/SupplierFileManage'], resolve)
const SupplierServiceInfo = resolve => require(['@/pages/resource/suppliermanage/SupplierServiceInfo'], resolve)

// 资源-操作库管理
const MaterialLibrary = resolve => require(['@/pages/operator/MaterialLibrary'], resolve)

// 资源-文物管理-库存列表
const InventoryList = resolve => require(['@/pages/antiquitiesmanage/InventoryList'], resolve)
// 文物管理-增加文物
const AddAntique = resolve => require(['@/pages/antiquitiesmanage/AddAntique'], resolve)

// 资源
// 公司管理-组织机构
const OrgList = resolve => require(['@/pages/companymanage/org/OrgList'], resolve)
// 公司管理-角色管理
const PostList = resolve => require(['@/pages/companymanage/postmanage/PostList'], resolve)
const AddPost = resolve => require(['@/pages/companymanage/postmanage/AddPost'], resolve)
// 公司管理-岗位管理
const JobList = resolve => require(['@/pages/companymanage/jobmanage/JobList'], resolve)
// 公司管理-人员管理
const userManageList = resolve => require(['@/pages/companymanage/usermanage/userManageList'], resolve)
// 公司管理-库房管理
const StoreRoom = resolve => require(['@/pages/companymanage/storemanage/StoreRoom'], resolve)
// 公司管理-审批管理
const ExamineManage = resolve => require(['@/pages/companymanage/examinemanage/ExamineManage'], resolve)
// 公司管理-通讯录
const AddressBookList = resolve => require(['@/pages/companymanage/addressbook/AddressBookList'], resolve)

// 角色
const RoleList = resolve => require(['@/pages/role/RoleList'], resolve)
const RoleAdd = resolve => require(['@/pages/role/RoleAdd'], resolve)

// 公告管理
const Info = resolve => require(['@/pages/info/Info'], resolve)

// 报关统计
const BondList = resolve => require(['@/pages/customsstatistics/BondList'], resolve)
const GuaranteeFreeList = resolve => require(['@/pages/customsstatistics/GuaranteeFreeList'], resolve)
const GuaranteeInsuranceList = resolve => require(['@/pages/customsstatistics/GuaranteeInsuranceList'], resolve)
const TaxStatisticsList = resolve => require(['@/pages/customsstatistics/TaxStatisticsList'], resolve)
// 消息中心
const MessageCenter = resolve => require(['@/pages/message/MessageCenter'], resolve)

// const PaymentPrint = resolve => require(['@/pages/financemanage/payment/PaymentPrint'], resolve)
// 审批
const ProcessDefinition = resolve => require(['@/pages/work/processDefinition/Index'], resolve)
const ApprovalIndex = resolve => require(['@/pages/work/Index'], resolve)
const ApprovalLayout = resolve => require(['@/pages/work/ApprovalLayout'], resolve)
const ApprovalDetails = resolve => require(['@/pages/work/ApprovalDetails'], resolve)
const paymentApplicationDetails = resolve => require(['@/pages/work/payment/ApplicationDetails'], resolve)
const PaymentApplicationAdd = resolve => require(['@/pages/work/payment/ApplicationAdd'], resolve)

const InvoiceApplicationDetails = resolve => require(['@/pages/work/invoices/ApplicationDetails'], resolve)
const InvoicesApplicationAdd = resolve => require(['@/pages/work/invoices/ApplicationAdd'], resolve)
const BorrowApplicationDetails = resolve => require(['@/pages/work/borrow/ApplicationDetails'], resolve)
const BorrowApplicationAdd = resolve => require(['@/pages/work/borrow/ApplicationAdd'], resolve)

const ReimburseApplicationDetails = resolve => require(['@/pages/work/reimburse/ApplicationDetails'], resolve)
const ReimburseApplicationAdd = resolve => require(['@/pages/work/reimburse/ApplicationAdd'], resolve)
const TravelApplicationDetails = resolve => require(['@/pages/work/travel/ApplicationDetails'], resolve)
const TravelApplicationAdd = resolve => require(['@/pages/work/travel/ApplicationAdd'], resolve)

const ExpenditureApplicationDetails = resolve => require(['@/pages/work/expenditure/ApplicationDetails'], resolve)
const ExpenditureApplicationAdd = resolve => require(['@/pages/work/expenditure/ApplicationAdd'], resolve)

// 操作库
const ToolsApplicationAdd = resolve => require(['@/pages/work/library/tools/ApplicationAdd'], resolve)
const MaterialApplicationAdd = resolve => require(['@/pages/work/library/material/ApplicationAdd'], resolve)


const customerVisitsAdd = resolve => require(['@/pages/work/customerVisits/ApplicationAdd'], resolve)
const MarketDevelopmentAdd = resolve => require(['@/pages/work/marketDevelopment/ApplicationAdd'], resolve)

const LibraryApplicationDetails = resolve => require(['@/pages/work/library/ApplicationDetails'], resolve)


// 车辆审批
const ETCAdd = resolve => require(['@/pages/work/vehicle/etc/ApplicationAdd'], resolve)
const InsuranceAdd = resolve => require(['@/pages/work/vehicle/insurance/ApplicationAdd'], resolve)
const OilCardAdd = resolve => require(['@/pages/work/vehicle/oilCard/ApplicationAdd'], resolve)
const MaintainAdd = resolve => require(['@/pages/work/vehicle/maintain/ApplicationAdd'], resolve)

const OilCardDetails = resolve => require(['@/pages/work/vehicle/oilCard/ApplicationDetails'], resolve)
const MaintainDetails = resolve => require(['@/pages/work/vehicle/maintain/ApplicationDetails'], resolve)
const InsuranceRecordDetails = resolve => require(['@/pages/work/vehicle/insurance/ApplicationDetails'], resolve)
// 业务
const OfferApprovalDetails = resolve => require(['@/pages/work/offer/Details'], resolve)
const BidAdd = resolve => require(['@/pages/work/bid/Add'], resolve)
const ApprovalDetailsBid = resolve => require(['@/pages/work/bid/Details'], resolve)
const ApprovalDetailsContract = resolve => require(['@/pages/work/contract/Details'], resolve)
const ContractAdd = resolve => require(['@/pages/work/contract/Add'], resolve)


// 任务
const TaskIndex = resolve => require(['@/pages/task/Index'], resolve)
const TaskList = resolve => require(['@/pages/task/TaskList'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Layout,
      name: '首页',
      iconCls: 'shouye',
      hidden: true,
      children: [
        {
          path: '/router/home',
          component: HomePage,
          name: '首页',
          hidden: true
        }
      ]
    },
    {
      path: '/router/empty',
      component: Layout,
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: Layout,
      name: '业务',
      iconCls: 'yewu',
      hidden: true,
      children: [
        {
          path: '/router/taskIndex',
          component: TaskIndex,
          name: '任务首页',
          hidden: true
        }, {
          path: '/router/tasksList',
          component: TaskList,
          name: '我的任务',
          hidden: true
        }
      ]
    },
    {
      path: '/',
      component: Layout,
      name: '审批',
      hidden: false,
      iconCls: 'iconfont icon-yichangguanli shenpi', // 图标样式class
      children: [
        {
          path: '/router/approvalIndex',
          component: ApprovalIndex,
          name: '审批',
          hidden: false
        },
        {
          path: '/router/processDefinition',
          component: ProcessDefinition,
          name: '流程定义',
          hidden: false

        },
        {
          path: '/router/materialApplication',
          component: ApprovalLayout,
          name: '物料审批',
          hidden: false

        },
        {
          path: '/router/addMaterialApplication',
          component: MaterialApplicationAdd,
          name: '物料申请',
          hidden: false
        }, {
          path: '/router/editMaterialApplication',
          component: MaterialApplicationAdd,
          name: '编辑物料申请',
          hidden: false
        }, {
          path: '/router/materialApplicationDetails',
          component: LibraryApplicationDetails,
          name: '物料详情',
          hidden: false
        }, {
          path: '/router/materialApprovalDetails',
          component: ApprovalDetails,
          name: '物料审批详情',
          hidden: false
        }, {
          path: '/router/toolsApplication',
          component: ApprovalLayout,
          name: '工具审批',
          hidden: false

        }, {
          path: '/router/addToolsApplication',
          component: ToolsApplicationAdd,
          name: '工具申请',
          hidden: false
        }, {
          path: '/router/editToolsApplication',
          component: MaterialApplicationAdd,
          name: '编辑工具申请',
          hidden: false
        }, {
          path: '/router/toolsApplicationDetails',
          component: LibraryApplicationDetails,
          name: '工具详情',
          hidden: false
        }, {
          path: '/router/toolsApprovalDetails',
          component: ApprovalDetails,
          name: '工具审批详情',
          hidden: false
        }, {
          path: '/router/paymentApplication',
          component: ApprovalLayout,
          name: '付款申请',
          hidden: false

        }, {
          path: '/router/addPaymentApplication',
          component: PaymentApplicationAdd,
          name: '付款申请',
          hidden: false
        }, {
          path: '/router/editPaymentApplication',
          component: PaymentApplicationAdd,
          name: '付款申请编辑',
          hidden: false
        }, {
          path: '/router/paymentApplicationDetails',
          component: paymentApplicationDetails,
          name: '付款申请详情',
          hidden: false
        }, {
          path: '/router/paymentApprovalDetails',
          component: ApprovalDetails,
          name: '审批付款详情',
          hidden: false
        }, {
          path: '/router/invoicesApplication',
          component: ApprovalLayout,
          name: '发票申请',
          hidden: false

        }, {
          path: '/router/addInvoiceApplication',
          component: InvoicesApplicationAdd,
          name: '添加发票申请',
          hidden: false

        }, {
          path: '/router/editInvoiceApplication',
          component: InvoicesApplicationAdd,
          name: '编辑发票申请',
          hidden: false

        }, {
          path: '/router/invoiceApplicationDetails',
          component: InvoiceApplicationDetails,
          name: '发票申请详情',
          hidden: false

        }, {
          path: '/router/invoiceApprovalDetails',
          component: ApprovalDetails,
          name: '审批发票详情',
          hidden: false
        }, {
          path: '/router/borrowApplication',
          component: ApprovalLayout,
          name: '借款申请',
          hidden: false

        }, {
          path: '/router/addBorrowApplication',
          component: BorrowApplicationAdd,
          name: '添加借款申请',
          hidden: false

        }, {
          path: '/router/editBorrowApplication',
          component: BorrowApplicationAdd,
          name: '编辑借款申请',
          hidden: false

        }, {
          path: '/router/borrowApplicationDetails',
          component: BorrowApplicationDetails,
          name: '借款申请详情',
          hidden: false

        }, {
          path: '/router/borrowApprovalDetails',
          component: ApprovalDetails,
          name: '审批借款详情',
          hidden: false
        }, {
          path: '/router/reimburseApplication',
          component: ApprovalLayout,
          name: '报销申请',
          hidden: false

        }, {
          path: '/router/addReimBurseApplication',
          component: ReimburseApplicationAdd,
          name: '添加报销申请',
          hidden: false

        }, {
          path: '/router/editReimburseApplication',
          component: ReimburseApplicationAdd,
          name: '编辑报销申请',
          hidden: false

        }, {
          path: '/router/reimburseApplicationDetails',
          component: ReimburseApplicationDetails,
          name: '报销申请详情',
          hidden: false

        }, {
          path: '/router/reimburseApprovalDetails',
          component: ApprovalDetails,
          name: '审批报销详情',
          hidden: false
        }, {
          path: '/router/travelApplication',
          component: ApprovalLayout,
          name: '差旅申请',
          hidden: false

        }, {
          path: '/router/editTravelApplication',
          component: TravelApplicationAdd,
          name: '编辑差旅申请',
          hidden: false

        }, {
          path: '/router/travelApplicationDetails',
          component: TravelApplicationDetails,
          name: '申请差旅详情',
          hidden: false

        }, {
          path: '/router/travelApprovalDetails',
          component: ApprovalDetails,
          name: '审批差旅详情',
          hidden: false
        }, {
          path: '/router/addTravelApplication',
          component: TravelApplicationAdd,
          name: '添加差旅申请',
          hidden: false

        }, {
          path: '/router/expenditureApplication',
          component: ApprovalLayout,
          name: '行政支出申请',
          hidden: false

        }, {
          path: '/router/editExpenditureApplication',
          component: ExpenditureApplicationAdd,
          name: '编辑行政支出申请',
          hidden: false

        }, {
          path: '/router/expenditureApplicationDetails',
          component: ExpenditureApplicationDetails,
          name: '行政支出详情',
          hidden: false

        }, {
          path: '/router/expenditureApprovalDetails',
          component: ApprovalDetails,
          name: '审批行政支出详情',
          hidden: false
        }, {
          path: '/router/addExpenditureApplication',
          component: ExpenditureApplicationAdd,
          name: '添加行政支出',
          hidden: false

        }, {
          path: '/router/bidApproval',
          component: ApprovalLayout,
          name: '投标审批',
          hidden: false

        }, {
          path: '/router/addBid',
          component: BidAdd,
          name: '添加投标',
          hidden: false

        }, {
          path: '/router/bidApprovalDetails',
          component: ApprovalDetailsBid,
          name: '投标审批详情',
          hidden: false

        }, {
          path: '/router/contractApproval',
          component: ApprovalLayout,
          name: '合同审批',
          hidden: false

        }, {
          path: '/router/contractApprovalDetails',
          component: ApprovalDetailsContract,
          name: '合同审批详情',
          hidden: false
        }, {
          path: '/router/addContract',
          component: ContractAdd,
          name: '添加合同',
          hidden: false

        }, {
          path: '/router/offerApproval',
          component: ApprovalLayout,
          name: '报价审批',
          hidden: false

        }, {
          path: '/router/offerApprovalDetails',
          component: OfferApprovalDetails,
          name: '报价审批详情',
          hidden: false

        }, {
          path: '/router/customsApproval',
          component: ApprovalLayout,
          name: '报关审批',
          hidden: false

        }, {
          path: '/router/customsApprovalDetails',
          component: ApprovalDetails,
          name: '报关审批详情',
          hidden: false

        }, {
          path: '/router/etcApplication',
          component: ApprovalLayout,
          name: 'ETC审批',
          hidden: false

        }, {
          path: '/router/addEtcApplication',
          component: ETCAdd,
          name: 'ETC申请',
          hidden: false

        }, {
          path: '/router/editEtcApplication',
          component: ETCAdd,
          name: '编辑ETC申请',
          hidden: false

        }, {
          path: '/router/etcApprovalDetails',
          component: ApprovalDetails,
          name: 'ETC审批详情',
          hidden: false

        }, {
          path: '/router/insuranceApplication',
          component: ApprovalLayout,
          name: '出险记录审批',
          hidden: false

        }, {
          path: '/router/addInsuranceRecordApplication',
          component: InsuranceAdd,
          name: '添加出险记录',
          hidden: false

        }, {
          path: '/router/editInsuranceRecordApplication',
          component: InsuranceAdd,
          name: '编辑出险记录',
          hidden: false

        }, {
          path: '/router/insuranceRecordApplicationDetails',
          component: InsuranceRecordDetails,
          name: '出险记录详情',
          hidden: false

        }, {
          path: '/router/insuranceRecordApprovalDetails',
          component: ApprovalDetails,
          name: '出险记录审批详情',
          hidden: false

        }, {
          path: '/router/oilCardApplication',
          component: ApprovalLayout,
          name: '油卡申请',
          hidden: false

        }, {
          path: '/router/addOilCardApplication',
          component: OilCardAdd,
          name: '添加油卡申请',
          hidden: false

        }, {
          path: '/router/editOilCardApplication',
          component: OilCardAdd,
          name: '编辑油卡申请',
          hidden: false

        }, {
          path: '/router/oilCardApplicationDetails',
          component: OilCardDetails,
          name: '申请油卡详情',
          hidden: false

        }, {
          path: '/router/oilCardApprovalDetails',
          component: ApprovalDetails,
          name: '审批油卡详情',
          hidden: false
        }, {
          path: '/router/addMaintainApplication',
          component: MaintainAdd,
          name: '添加维修保养',
          hidden: false

        }, {
          path: '/router/MaintainApplication',
          component: ApprovalLayout,
          name: '维修保养申请',
          hidden: false

        }, {
          path: '/router/editMaintainApplication',
          component: MaintainAdd,
          name: '编辑维修保养',
          hidden: false

        }, {
          path: '/router/maintainApplicationDetails',
          component: MaintainDetails,
          name: '维修保养详情',
          hidden: false

        }, {
          path: '/router/maintainApprovalDetails',
          component: ApprovalDetails,
          name: '维修保养审批详情',
          hidden: false
        }, {
          path: '/router/customerVisits',
          component: ApprovalLayout,
          name: '客户走访',
          hidden: false
        }, {
          path: '/router/addCustomerVisits',
          component: customerVisitsAdd,
          name: '客户走访申请',
          hidden: false
        }, {
          path: '/router/editCustomerVisits',
          component: customerVisitsAdd,
          name: '客户走访编辑',
          hidden: false
        }, {
          path: '/router/customerVisitsDetails',
          component: ApprovalDetails,
          name: '客户走访详情',
          hidden: false
        }, {
          path: '/router/marketDevelopment',
          component: ApprovalLayout,
          name: '市场开拓',
          hidden: false
        }, {
          path: '/router/addMarketDevelopment',
          component: MarketDevelopmentAdd,
          name: '市场开拓申请',
          hidden: false
        }, {
          path: '/router/editMarketDevelopment',
          component: MarketDevelopmentAdd,
          name: '市场开拓编辑',
          hidden: false
        }, {
          path: '/router/marketDevelopmentDetails',
          component: ApprovalDetails,
          name: '市场开拓详情',
          hidden: false
        },
      ]
    }, {
      path: '/',
      component: Layout,
      name: '我的',
      iconCls: 'iconfont icon-renwuguanli yewu',
      hidden: false,
      children: [
        {
          path: '/router/myTask',
          component: MyTask,
          name: '我的任务',
          hidden: false
        },
        {
          path: '/router/myAudit',
          component: MyAudit,
          name: '业务审批',
          hidden: false
        },
        {
          path: '/router/MyAuditAdministration',
          component: MyAuditAdministration,
          name: '行政审批',
          hidden: false
        },
        {
          path: '/router/myApply',
          component: MyApply,
          name: '业务申请',
          hidden: false
        }, {
          path: '/router/MyApplyAdministration',
          component: MyApplyAdministration,
          name: '行政申请',
          hidden: false
        }, {
          path: '/router/myProject',
          component: MyProject,
          name: '我的项目',
          hidden: false
        }, {
          path: '/router/createTask',
          component: CreateTask,
          name: '创建任务',
          hidden: true
        }, {
          path: '/router/addCustomsclearance',
          component: AddCustomsclearance,
          name: '新增报关',
          hidden: true
        }, {
          path: '/router/taskDetail',
          component: TaskDetail,
          name: '任务详情',
          hidden: true
        }, {
          path: '/router/baoGuanTaskCommit',
          component: BaoGuanTaskCommit,
          name: '报关任务提交',
          hidden: true
        }, {
          path: '/router/baoZhuangTaskCommit',
          component: BaoGuanTaskCommit,
          name: '包装任务提交',
          hidden: true
        }, {
          path: '/router/outSideTaskCommit',
          component: OutSideTaskCommit,
          name: '外勤任务提交',
          hidden: true
        }, {
          path: '/router/projectDetail',
          component: ProjectDetail,
          name: '项目详情',
          hidden: true
        }, {
          path: '/router/projectOfferPreview',
          component: ProjectOfferPreview,
          name: '报价预览',
          hidden: true
        }, {
          path: '/router/projectIntercourseAccount',
          component: ProjectIntercourseAccount,
          name: '往来账务',
          hidden: true
        },

      ]
    }, 
    // {
    //   path: '/',
    //   component: Layout,
    //   name: '客户走访',
    //   iconCls: 'iconfont icon-huaban yewu',
    //   hidden: true,
    // },
    {
      path: '/',
      component: Layout,
      name: '仓储管理',
      iconCls: 'iconfont icon-huaban yewu',
      hidden: false,
      children: [
        {
          path: '/router/nonBondedStorage',
          component: NonBondedStorageList,
          name: '库存列表',
          hidden: false
        },
        {
          path: '/router/receiptResult',
          component: ReceiptResultList,
          name: '回执结果',
          hidden: false
        },
        {
          path: '/router/addNobonded',
          component: AddNobonded,
          name: '创建库存',
          hidden: true
        },
        {
          path: '/router/editNobonded',
          component: AddNobonded,
          name: '编辑库存',
          hidden: true
        }, {
          path: '/router/nobondedDetails',
          component: AddNobonded,
          name: '库存详情',
          hidden: true
        }, {
          path: '/router/storageTask',
          component: StorageTask,
          name: '仓储任务',
          hidden: false
        }, {
          path: '/router/outboundDetails',
          component: OutboundDetails,
          name: '出库详情',
          hidden: true
        }, {
          path: '/router/storage',
          component: StorageList,
          name: '库存清单',
          hidden: false
        }, {
          path: '/router/operationLog',
          component: OperationLog,
          name: '操作日志',
          hidden: false
        }, {
          path: '/router/addStorageIn',
          component: AddStorageIn,
          name: '添加入库',
          hidden: true
        }, {
          path: '/router/addStorageOut',
          component: AddStorageOut,
          name: '添加出库',
          hidden: true
        }, {
          path: '/router/StockIn',
          component: StockIn,
          name: '入库',
          hidden: true
        }, {
          path: '/router/StockOut',
          component: StockOut,
          name: '出库',
          hidden: true
        }, {
          path: '/router/stockInAudit',
          component: StockInOutAudit,
          name: '入库核准',
          hidden: true
        }, {
          path: '/router/stockOutAudit',
          component: StockInOutAudit,
          name: '出库核准',
          hidden: true
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '项目管理',
      iconCls: 'iconfont icon-xiangmuguanli1 yewu',
      hidden: false,
      children: [
        {
          path: '/router/artworkList',
          component: ArtworkList,
          name: '现当代项目',
          hidden: false
        },
        {
          path: '/router/museumList',
          component: MuseumList,
          name: '博物馆项目',
          hidden: false
        },
        {
          path: '/router/auctionList',
          component: AuctionList,
          name: '拍卖行项目',
          hidden: false
        },
        {
          path: '/router/ArtDfgList',
          component: ArtDfgList,
          name: '免税品项目',
          hidden: false
        }, {
          path: '/router/airMaterialList',
          component: AirMaterialList,
          name: '航材项目',
          hidden: false
        }, {
          path: '/router/AddDfgProject',
          component: AddDfgProject,
          name: '新增免税品项目',
          hidden: true
        }, {
          path: '/router/addProject',
          component: AddProject,
          name: '新增艺术品项目',
          hidden: true
        }, {
          path: '/router/editProject',
          component: AddProject,
          name: '编辑项目',
          hidden: true
        }, {
          path: '/router/addAirProject',
          component: AddAirProject,
          name: '新增航材项目',
          hidden: true
        },
      ]
    }, {
      path: '/',
      component: Layout,
      name: '任务管理',
      iconCls: 'iconfont icon-huaban yewu',
      hidden: false,
      children: [
        {
          path: '/router/taskList',
          component: Tasklist,
          name: '任务列表',
          hidden: false
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '报关管理',
      iconCls: 'iconfont icon-baoguan yewu',
      hidden: false,
      children: [
        {
          path: '/router/customsManage',
          component: CustomsManage,
          name: '报关管理列表',
          hidden: false
        },
        {
          path: '/router/DfgCustomsManage',
          component: DfgCustomsManage,
          name: '报关列表',
          hidden: false
        },
        {
          path: '/router/addCustoms',
          component: AddCustoms,
          name: '添加报关',
          hidden: true
        },
        {
          path: '/router/AddDfgCustoms',
          component: AddDfgCustoms,
          name: '添加报关',
          hidden: true
        }, {
          path: '/router/bondList',
          component: BondList,
          name: '保证金统计',
          hidden: true
        }, {
          path: '/router/guaranteeInsuranceList',
          component: GuaranteeInsuranceList,
          name: '关税保证保险统计',
          hidden: true
        }, {
          path: '/router/guaranteeFreeList',
          component: GuaranteeFreeList,
          name: '免担保统计',
          hidden: true
        }, {
          path: '/router/taxStatisticsList',
          component: TaxStatisticsList,
          name: '税金统计',
          hidden: true
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '车辆管理',
      hidden: false,
      iconCls: 'iconfont icon-cheliangguanli yewu', // 图标样式class
      children: [
        {
          path: '/router/carList',
          component: CarList,
          name: '艺术品车辆列表',
          hidden: false
        },
        {
          path: '/router/carGoodsList',
          component: CarGoodsList,
          name: '免税品车辆列表',
          hidden: false
        },
        {
          path: '/router/carCustomsList',
          component: CarCustomsList,
          name: '报关车辆列表',
          hidden: false
        },
        {
          path: '/router/carAdminList',
          component: CarAdminList,
          name: '行政车辆列表',
          hidden: false
        }, {
          path: '/router/carAerialList',
          component: CarAerialList,
          name: '航材车辆列表',
          hidden: false
        }, {
          path: '/router/addCar',
          component: AddCar,
          name: '新增车辆',
          hidden: true
        }, {
          path: '/router/editCar',
          component: AddCar,
          name: '编辑车辆',
          hidden: true
        }, {
          path: '/router/carDetail',
          component: CarDetail,
          name: '车辆详情',
          hidden: true,
          redirect: '/router/transportCarInfo',
          children: [
            {
              path: '/router/transportCarInfo',
              component: TransportCarInfo,
              name: '运输车辆',
              hidden: true
            },
            {
              path: '/router/oilCard',
              component: OilCard,
              name: '油卡情况',
              hidden: true
            },
            {
              path: '/router/etc',
              component: ETC,
              name: 'ETC',
              hidden: true
            },
            {
              path: '/router/finance',
              component: CarFinance,
              name: ' 财务情况',
              hidden: true
            }, {
              path: '/router/maintenanceInfo',
              component: MaintenanceInfo,
              name: '保养维修',
              hidden: true
            }, {
              path: '/router/insuranceRecord',
              component: InsuranceRecord,
              name: '出险记录',
              hidden: true
            }, {
              path: '/router/regulationRecord',
              component: RegulationRecord,
              name: '违章记录',
              hidden: true
            }, {
              path: '/router/aboutProject',
              component: AboutProject,
              name: '有关项目',
              hidden: true
            }, {
              path: '/router/intendInspect',
              component: IntendInspect,
              name: '一日三检表',
              hidden: true
            }, {
              path: '/router/carInspect',
              component: CarInspect,
              name: '检查表',
              hidden: true
            }, {
              path: '/router/fileManage',
              component: FileManage,
              name: '文件管理',
              hidden: true
            }
          ]
        }, {
          path: '/router/addIntendInspect',
          component: AddIntendInspect,
          name: '添加一日三检备查表',
          hidden: true
        }, {
          path: '/router/selectIntendInspect',
          component: SelectIntendInspect,
          name: '查看一日三检备查表',
          hidden: true
        }, {
          path: '/router/addCarInspect',
          component: AddCarInspect,
          name: '添加车辆检测表',
          hidden: true
        }, {
          path: '/router/carMonitor',
          component: CarMonitor,
          name: '车辆监控',
          hidden: false
        }, {
          path: '/router/carGpsList',
          component: CarGpsList,
          name: '在途监控',
          hidden: false
        }, {
          path: '/router/carTracking',
          component: CarTracking,
          name: '车辆跟踪',
          hidden: true
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '公司管理',
      iconCls: 'iconfont icon-gongsi shezhi',
      hidden: false,
      children: [
        {
          path: '/router/organization',
          component: OrgList,
          name: '组织机构',
          hidden: false
        },
        {
          path: '/router/postList',
          component: PostList,
          name: '角色职责管理',
          hidden: false
        },
        {
          path: '/router/addPost',
          component: AddPost,
          name: '添加角色',
          hidden: true
        },
        {
          path: '/router/editPost',
          component: AddPost,
          name: '修改角色',
          hidden: true
        }, {
          path: '/router/jobList',
          component: JobList,
          name: '岗位管理',
          hidden: false
        }, {
          path: '/router/userManageList',
          component: userManageList,
          name: '人员管理',
          hidden: false
        }, {
          path: '/router/storeRoom',
          component: StoreRoom,
          name: '库房管理',
          hidden: false
        }, {
          path: '/router/examineManage',
          component: ExamineManage,
          name: '审批管理',
          hidden: false
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '投标管理',
      hidden: false,
      iconCls: 'iconfont icon-toubiaoguanli yewu', // 图标样式class
      children: [
        {
          path: '/router/biddingList',
          component: BiddingList,
          name: '艺术品投标列表',
          hidden: false
        },
        {
          path: '/router/aerialBiddingList',
          component: AerialBiddingList,
          name: '航材投标列表',
          hidden: false
        },
        {
          path: '/router/dutyFreeBiddingList',
          component: DutyFreeBiddingList,
          name: '免税品投标列表',
          hidden: false
        },
        {
          path: '/router/addBidProject',
          component: AddBidProject,
          name: '新增投标项目',
          hidden: false
        },
        // {
        // path: '/router/AddNewBiddingPro',
        // component: AddNewBiddingPro,
        // name: '新增投标项目',
        // hidden: false
        // },
        {
          path: '/router/editNewBiddingPro',
          component: EditNewBiddingPro,
          name: '编辑投标项目',
          hidden: true
        }, {
          path: '/router/biddingDetail',
          component: BiddingDetail,
          name: '投标详情',
          hidden: true,
          redirect: '/router/seniorityInfo',
          children: [
            {
              path: '/router/bidProjectSurvey',
              component: BidProjectSurvey,
              name: '项目勘察',
              hidden: true
            },
            {
              path: '/router/seniorityInfo',
              component: SeniorityInfo,
              name: '招投标信息',
              hidden: true
            },
            {
              path: '/router/bidSignup',
              component: BidSignUp,
              name: '招标报名',
              hidden: true
            },
            {
              path: '/router/contacts',
              component: Contacts,
              name: '联系人',
              hidden: true
            }, {
              path: '/router/intercourseAccount',
              component: IntercourseAccount,
              name: '财务申请',
              hidden: true
            }, {
              path: '/router/bidFileManage',
              component: BidFileManage,
              name: '附件管理',
              hidden: true
            }, {
              path: '/router/bidContractsList',
              component: ContractsList,
              name: '合同管理',
              hidden: true
            }, {
              path: '/router/bidProjectFinance',
              component: BidProjectFinance,
              name: '实际收支',
              hidden: true
            }, {
              path: '/router/biddingDocumentList',
              component: BiddingDocumentList,
              name: '标书审核',
              hidden: true
            }, {
              path: '/router/printList',
              component: PrintList,
              name: '投标前准备',
              hidden: true
            }, {
              path: '/router/feedback',
              component: Feedback,
              name: '开标信息',
              hidden: true
            }, {
              path: '/router/resultTracking',
              component: ResultTracking,
              name: '结果跟踪',
              hidden: true
            }, {
              path: '/router/bidQuestion',
              component: BidQuestion,
              name: '问题反馈',
              hidden: true
            }, {
              path: '/router/bidAttention',
              component: BidAttention,
              name: '注意事项',
              hidden: true
            },

          ]
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '异常管理',
      hidden: false,
      iconCls: 'iconfont icon-yichangguanli yewu', // 图标样式class
      children: [
        {
          path: '/router/exceptionList',
          component: ExceptionList,
          name: '异常列表',
          hidden: false
        }, {
          path: '/router/exceptionDetail',
          component: ExceptionDetail,
          name: '异常列表',
          hidden: true,
          redirect: '/router/exSituationDesc',
          children: [
            {
              path: '/router/exSituationDesc',
              component: ExSituationDesc,
              name: '情况说明',
              hidden: true
            }, {
              path: '/router/exDealResult',
              component: ExDealResult,
              name: '处理结果',
              hidden: true
            }, {
              path: '/router/exFileManage',
              component: ExFileManage,
              name: '异常文件管理',
              hidden: true
            }
          ]
        }
      ]
    }, 
    {
      path: '/',
      component: Layout,
      name: '统计分析管理',
      hidden: false,
      iconCls: 'iconfont icon-tongji tongji', // 图标样式class
      children: [
        {
          path: '/router/projectProfit',
          component: ProjectProfit,
          name: '项目利润率',
          hidden: false
        },
        {
          path: '/router/companyProfit',
          component: CompanyProfit,
          name: '公司收支',
          hidden: false
        },
        {
          path: '/router/departmentProfit',
          component: DepartmentProfit,
          name: '部门收支',
          hidden: false
        },
        {
          path: '/router/personProfit',
          component: PersonProfit,
          name: '人员收支',
          hidden: false
        }, {
          path: '/router/breakEvenAnalysis',
          component: BreakEvenAnalysis,
          name: '收支分析',
          hidden: false
        }, {
          path: '/router/projectBreakEven',
          component: ProjectBreakEven,
          name: '项目收支',
          hidden: false
        }, {
          path: '/router/projectBreakEvenDetails',
          component: ProjectBreakEvenDetails,
          name: '收支明细',
          hidden: false
        }, {
          path: '/router/myProjectFinanceDetails',
          component: ProjectFinanceDetails,
          name: '项目收支表',
          hidden: false
        }, {
          path: '/router/SupplierStatistics',
          component: SupplierStatistics,
          name: '供应商统计',
          hidden: false
        }, {
          path: '/router/CustomerStatistics',
          component: CustomerStatistics,
          name: '客户统计',
          hidden: false
        }, {
          path: '/router/aerialMaterialList',
          component: AerialMaterialList,
          name: '航材报关表',
          hidden: false
        }, {
          path: '/router/addAerialMaterial',
          component: AddAerialMaterial,
          name: '新增航材报关表',
          hidden: true
        }, {
          path: '/router/GoodsWarehouse',
          component: GoodsWarehouse,
          name: '免税品仓库',
          hidden: true
        }, {
          path: '/router/TransportationManagement',
          component: TransportationManagement,
          name: '免税品运输管理',
          hidden: true
        }, {
          path: '/router/AerTransportationManagement',
          component: AerTransportationManagement,
          name: '航材运输管理',
          hidden: true
        }, {
          path: '/router/ArtTransportationManagement',
          component: ArtTransportationManagement,
          name: '艺术品运输管理',
          hidden: true
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '合同管理',
      hidden: false,
      iconCls: 'iconfont icon-XYZY_YH caiwu', // 图标样式class
      children: [
        {
          path: '/router/contractsList',
          component: ContractsList,
          name: '现当代业务合同',
          hidden: false
        },
        {
          path: '/router/auctionContractsList',
          component: AuctionContractsList,
          name: '拍卖行业务合同',
          hidden: false
        },
        {
          path: '/router/museumContractsList',
          component: MuseumContractsList,
          name: '博物馆业务合同',
          hidden: false
        },
        {
          path: '/router/addContracts',
          component: AddContracts,
          name: '新增艺术品业务合同',
          hidden: true
        }, {
          path: '/router/contractsDetails',
          component: ContractsDetails,
          name: '艺术品业务合同详情',
          hidden: true
        }, {
          path: '/router/goodsContractsList',
          component: GoodsContractsList,
          name: '免税品业务合同',
          hidden: false
        }, {
          path: '/router/goodsAddContracts',
          component: GoodsAddContracts,
          name: '新增免税品业务合同',
          hidden: true
        }, {
          path: '/router/goodsContractsDetails',
          component: GoodsContractsDetails,
          name: '免税品业务合同详情',
          hidden: true
        }, {
          path: '/router/aerialContractsList',
          component: AerialContractsList,
          name: '航材业务合同',
          hidden: false
        }, {
          path: '/router/aerialAddContracts',
          component: AerialAddContracts,
          name: '新增航材业务合同',
          hidden: true
        }, {
          path: '/router/aerialContractsDetails',
          component: AerialContractsDetails,
          name: '航材业务合同详情',
          hidden: true
        }, {
          path: '/router/adminContractsList',
          component: AdminContractsList,
          name: '行政合同',
          hidden: false
        }, {
          path: '/router/addAdminContracts',
          component: AddAdminContracts,
          name: '新增行政合同',
          hidden: true
        }, {
          path: '/router/adminContractsDetails',
          component: AdminContractsDetails,
          name: '行政合同详情',
          hidden: true
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '财务管理',
      hidden: false,
      iconCls: 'iconfont icon-caiwu caiwu', // 图标样式class
      children: [
        {
          path: '/router/invoiceList',
          component: InvoiceList,
          name: '发票管理',
          hidden: false
        },
        {
          path: '/router/invoiceDetail',
          component: InvoiceDetail,
          name: '发票详情',
          hidden: true
        },
        {
          path: '/router/auditDetail',
          component: InvoiceDetail,
          name: '审批详情',
          hidden: true
        },
        {
          path: '/router/addInvoiceApply',
          component: InvoiceApply,
          name: '发票申请',
          hidden: true
        }, {
          path: '/router/editInvoiceApply',
          component: InvoiceApplyEdit,
          name: '发票编辑',
          hidden: true
        }, {
          path: '/router/accountAdvance',
          component: AccountAdvance,
          name: '进账列表',
          hidden: true
        }, {
          path: '/router/accountAdvanceEdit',
          component: AccountAdvanceEdit,
          name: '进账编辑',
          hidden: true
        }, {
          path: '/router/paymentList',
          component: PaymentList,
          name: '付款管理',
          hidden: false
        }, {
          path: '/router/addPaymentApply',
          component: PaymentApply,
          name: '付款申请',
          hidden: true
        }, {
          path: '/router/editPaymentApply',
          component: PaymentApplyEdit,
          name: '付款编辑',
          hidden: true
        }, {
          path: '/router/paymentDetail',
          component: PaymentDetail,
          name: '付款详情',
          hidden: true
        }, {
          path: '/router/paymentAuditDetail',
          component: PaymentAuditDetail,
          name: '付款审批详情',
          hidden: true
        }, {
          path: '/router/borrowList',
          component: BorrowList,
          name: '借款管理',
          hidden: false
        }, {
          path: '/router/addBorrowApply',
          component: BorrowApply,
          name: '借款申请',
          hidden: true
        }, {
          path: '/router/editBorrowApply',
          component: BorrowApplyEdit,
          name: '借款编辑',
          hidden: true
        }, {
          path: '/router/borrowDetail',
          component: BorrowDetail,
          name: '借款详情',
          hidden: true
        }, {
          path: '/router/borrowAuditDetail',
          component: BorrowAuditDetail,
          name: '借款审批详情',
          hidden: true
        }, {
          path: '/router/reimburseList',
          component: ReimburseList,
          name: '报销管理',
          hidden: false
        }, {
          path: '/router/addReimburseApply',
          component: ReimburseApply,
          name: '报销申请',
          hidden: true
        }, {
          path: '/router/editReimburseApply',
          component: ReimburseApplyEdit,
          name: '报销申请编辑',
          hidden: true
        }, {
          path: '/router/reimburseDetail',
          component: ReimburseDetail,
          name: '报销申请详情',
          hidden: true
        }, {
          path: '/router/reimburseAuditDetail',
          component: ReimburseAuditDetail,
          name: '报销审批详情',
          hidden: true
        }, {
          path: '/router/travelManagement',
          component: TravelManagement,
          name: '差旅管理',
          hidden: false
        }, {
          path: '/router/addTravelApply',
          component: TravelApply,
          name: '申请差旅报销',
          hidden: true
        }, {
          path: '/router/editTravelApply',
          component: TravelApplyEdit,
          name: '编辑差旅报销',
          hidden: true
        }, {
          path: '/router/travelDetails',
          component: TravelDetails,
          name: '差旅详情',
          hidden: true
        }, {
          path: '/router/travelApproval',
          component: TravelApproval,
          name: '差旅审批详情',
          hidden: true
        }, {
          path: '/router/administrationList',
          component: AdministrationList,
          name: '行政管理',
          hidden: false
        }, {
          path: '/router/AdministrationAuditDetail',
          component: AdministrationAuditDetail,
          name: '行政审批详情',
          hidden: true
        }, {
          path: '/router/AdministrationDetail',
          component: AdministrationDetail,
          name: '行政详情',
          hidden: true
        }, {
          path: '/router/AdministrationApply',
          component: AdministrationApply,
          name: '申请行政支出',
          hidden: true
        }, {
          path: '/router/AdministrationApplyEdit',
          component: AdministrationApplyEdit,
          name: '编辑申请行政支出',
          hidden: true
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '文件管理',
      hidden: false,
      iconCls: 'iconfont icon-xiangmuguanli ziyuan', // 图标样式class
      children: [
        {
          path: '/router/fileStructure',
          component: FileStructure,
          name: '文件架构',
          hidden: false
        }, {
          path: '/router/fileList',
          component: FileList,
          name: '文件列表',
          hidden: false
        }, {
          path: '/router/projectFile',
          component: ProjectFile,
          name: '项目文件',
          hidden: false
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '公告信息',
      hidden: false,
      iconCls: 'iconfont ziyuan', // 图标样式class
      children: [
        {
          path: '/router/notice',
          component: Info,
          name: '公告列表',
          hidden: false
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '通讯录管理',
      hidden: false,
      iconCls: 'iconfont icon-tongxunlu', // 图标样式class
      children: [
        {
          path: '/router/addressBookList',
          component: AddressBookList,
          name: '通讯录列表',
          hidden: false
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '战略合作伙伴管理',
      hidden: false,
      iconCls: 'iconfont icon-hezuohuoban', // 图标样式class
      children: [
        {
          path: '/router/partnerList',
          component: PartnerList,
          name: '战略合作伙伴',
          hidden: false
        }, {
          path: '/router/addPartner',
          component: AddPartner,
          name: '新增战略合作伙伴',
          hidden: true
        }, {
          path: '/router/editPartner',
          component: AddPartner,
          name: '编辑战略合作伙伴',
          hidden: true
        }, {
          path: '/router/partnerDetail',
          component: PartnerDetail,
          name: '战略合作伙伴详情',
          hidden: true,
          redirect: '/router/partnerSeniorityInfo',
          children: [
            {
              path: '/router/partnerSeniorityInfo',
              component: SupplierSeniorityInfo,
              name: '资质信息',
              hidden: true
            },
            {
              path: '/router/partnerContacts',
              component: Contacts,
              name: '联系人',
              hidden: true
            },
            {
              path: '/router/partnerContract',
              component: Contract,
              name: '往来合同',
              hidden: true
            },
            {
              path: '/router/partnerAccount',
              component: IntercourseAccount,
              name: '往来账务',
              hidden: true
            }, {
              path: '/router/partnerFileManage',
              component: SupplierFileManage,
              name: '文件管理',
              hidden: true
            }
          ]
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '客户管理',
      hidden: false,
      iconCls: 'iconfont icon-customer-mgr', // 图标样式class.
      children: [
        {
          path: '/router/customerList',
          component: CustomerList,
          name: '博物馆客户列表',
          hidden: false
        },
        {
          path: '/router/addCustomer',
          component: AddCustomer,
          name: '新增客户',
          hidden: true
        },
        {
          path: '/router/editCustomer',
          component: AddCustomer,
          name: '编辑客户',
          hidden: true
        },
        {
          path: '/router/customerDetail',
          component: CustomerDetail,
          name: '客户详情',
          hidden: true,
          redirect: '/router/customerSeniorityInfo',
          children: [
            {
              path: '/router/customerSeniorityInfo',
              component: SupplierSeniorityInfo,
              name: '资质信息',
              hidden: true
            },
            {
              path: '/router/customerContacts',
              component: Contacts,
              name: '联系人',
              hidden: true
            },
            {
              path: '/router/customerContract',
              component: Contract,
              name: '往来合同',
              hidden: true
            },
            {
              path: '/router/customerAccount',
              component: IntercourseAccount,
              name: '往来账务',
              hidden: true
            }, {
              path: '/router/customerAboutProject',
              component: AboutProject,
              name: '有关项目',
              hidden: true
            }, {
              path: '/router/customerFileManage',
              component: SupplierFileManage,
              name: '文件管理',
              hidden: true
            }
          ]
        }, {
          path: '/router/aerialCustomerList',
          component: AerialCustomerList,
          name: '航材客户列表',
          hidden: false
        }, {
          path: '/router/contemCustomerList',
          component: ContemCustomerList,
          name: '现当代客户列表',
          hidden: false
        }, {
          path: '/router/galleryCustomerList',
          component: GalleryCustomerList,
          name: '画廊客户列表',
          hidden: false
        }, {
          path: '/router/aerialAddCustomer',
          component: AerialAddCustomer,
          name: '新增客户',
          hidden: true
        }, {
          path: '/router/aerialEditCustomer',
          component: AerialAddCustomer,
          name: '编辑客户',
          hidden: true
        }, {
          path: '/router/aerialCustomerDetail',
          component: AerialCustomerDetail,
          name: '客户详情',
          hidden: true,
          redirect: '/router/customerSeniorityInfo',
          children: [
            {
              path: '/router/customerSeniorityInfo',
              component: SupplierSeniorityInfo,
              name: '资质信息',
              hidden: true
            },
            {
              path: '/router/customerContacts',
              component: Contacts,
              name: '联系人',
              hidden: true
            },
            {
              path: '/router/customerContract',
              component: Contract,
              name: '往来合同',
              hidden: true
            },
            {
              path: '/router/customerAccount',
              component: IntercourseAccount,
              name: '往来账务',
              hidden: true
            }, {
              path: '/router/customerAboutProject',
              component: AboutProject,
              name: '有关项目',
              hidden: true
            }, {
              path: '/router/customerFileManage',
              component: SupplierFileManage,
              name: '文件管理',
              hidden: true
            }
          ]
        }, {
          path: '/router/goodsCustomerList',
          component: GoodsCustomerList,
          name: '免税品客户列表',
          hidden: false
        }, {
          path: '/router/goodsAddCustomer',
          component: GoodsAddCustomer,
          name: '新增客户',
          hidden: true
        }, {
          path: '/router/goodsEditCustomer',
          component: GoodsAddCustomer,
          name: '编辑客户',
          hidden: true
        }, {
          path: '/router/goodsCustomerDetail',
          component: GoodsCustomerDetail,
          name: '客户详情',
          hidden: true,
          redirect: '/router/customerSeniorityInfo',
          children: [
            {
              path: '/router/customerSeniorityInfo',
              component: SupplierSeniorityInfo,
              name: '资质信息',
              hidden: true
            },
            {
              path: '/router/customerContacts',
              component: Contacts,
              name: '联系人',
              hidden: true
            },
            {
              path: '/router/customerContract',
              component: Contract,
              name: '往来合同',
              hidden: true
            },
            {
              path: '/router/customerAccount',
              component: IntercourseAccount,
              name: '往来账务',
              hidden: true
            }, {
              path: '/router/customerAboutProject',
              component: AboutProject,
              name: '有关项目',
              hidden: true
            }, {
              path: '/router/customerFileManage',
              component: SupplierFileManage,
              name: '文件管理',
              hidden: true
            }
          ]
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '供应商管理',
      hidden: false,
      iconCls: 'iconfont icon-gongyingshangguanli1', // 图标样式class

      children: [
        {
          path: '/router/supplierList',
          component: SupplierList,
          name: '业务供应商',
          hidden: false
        },
        {
          path: '/router/goodsSupplierList',
          component: GoodsSupplierList,
          name: '业务供应商',
          hidden: false
        },
        {
          path: '/router/aerialSupplierList',
          component: AerialSupplierList,
          name: '业务供应商',
          hidden: false
        },
        {
          path: '/router/supplierMaterielList',
          component: SupplierMaterielList,
          name: '物料供应商',
          hidden: false
        }, {
          path: '/router/supplierOuterWorkerList',
          component: SupplierOuterWorkerList,
          name: '外工供应商',
          hidden: false
        }, {
          path: '/router/SupplierOuterWorkerDetails',
          component: SupplierOuterWorkerDetails,
          name: '外工供应商详情',
          hidden: false,
          redirect: '/router/outerWorkerSeniorityInfo',
          children: [
            {
              path: '/router/outerWorkerSeniorityInfo',
              component: OuterWorkerSeniorityInfo,
              name: '资质信息',
              hidden: true
            },
            {
              path: '/router/outerWorkerPastExperience',
              component: OuterWorkerPastExperience,
              name: '过往经历',
              hidden: true
            },
            {
              path: '/router/outerWorkerContacts',
              component: OuterWorkerContacts,
              name: '紧急联系人',
              hidden: true
            },
            {
              path: '/router/outerWorkerSkills',
              component: OuterWorkerSkills,
              name: '技能特长',
              hidden: true
            }, {
              path: '/router/outerWorkerAccount',
              component: IntercourseAccount,
              name: '往来财务',
              hidden: true
            }, {
              path: '/router/outerWorkerContract',
              component: Contract,
              name: '往来合同',
              hidden: true
            }, {
              path: '/router/outerWorkerProject',
              component: AboutProject,
              name: '有关项目',
              hidden: true
            }, {
              path: '/router/outerWorkerFileManage',
              component: SupplierFileManage,
              name: '文件管理',
              hidden: true
            },
          ]
        }, {
          path: '/router/supplierAdministrationList',
          component: SupplierAdministrationList,
          name: '行政供应商',
          hidden: false
        }, {
          path: '/router/addOuterWorkerSupplier',
          component: AddOuterWorkerSupplier,
          name: '新增外工供应商',
          hidden: true
        }, {
          path: '/router/editOuterWorkerSupplier',
          component: AddOuterWorkerSupplier,
          name: '编辑外工供应商',
          hidden: true
        }, {
          path: '/router/addMaterielSupplier',
          component: MaterielSupplierAdd,
          name: '新增物料供应商',
          hidden: true
        }, {
          path: '/router/editMaterielSupplier',
          component: MaterielSupplierEdit,
          name: '编辑物料供应商',
          hidden: true
        }, {
          path: '/router/addSupplier',
          component: AddSupplier,
          name: '新增供应商',
          hidden: true
        }, {
          path: '/router/editSupplier',
          component: AddSupplier,
          name: '编辑供应商',
          hidden: true
        }, {
          path: '/router/supplierDetail',
          component: SupplierDetail,
          name: '供应商详情',
          hidden: true,
          redirect: '/router/supplierSeniorityInfo',
          children: [
            {
              path: '/router/supplierSeniorityInfo',
              component: SupplierSeniorityInfo,
              name: '资质信息',
              hidden: true
            },
            {
              path: '/router/supplierContacts',
              component: Contacts,
              name: '联系人',
              hidden: true
            },
            {
              path: '/router/supplierContract',
              component: Contract,
              name: '往来合同',
              hidden: true
            },
            {
              path: '/router/supplierAccount',
              component: IntercourseAccount,
              name: '往来账务',
              hidden: true
            }, {
              path: '/router/supplierAboutProject',
              component: AboutProject,
              name: '有关项目',
              hidden: true
            }, {
              path: '/router/supplierFileManage',
              component: SupplierFileManage,
              name: '文件管理',
              hidden: true
            }, {
              path: '/router/supplierServiceInfo',
              component: SupplierServiceInfo,
              name: '供应商信息',
              hidden: true
            }
          ]
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '操作库管理',
      hidden: false,
      iconCls: 'iconfont icon-kucun', // 图标样式class
      children: [
        {
          path: '/router/materialLibrary',
          component: MaterialLibrary,
          name: '物料库存列表',
          hidden: false
        }, {
          path: '/router/toolLibrary',
          component: MaterialLibrary,
          name: '工具库存列表',
          hidden: false
        }
      ]
    }, {
      path: '/',
      component: Layout,
      name: '文物库管理',
      hidden: false,
      iconCls: 'iconfont icon-wenwubaohu', // 图标样式class
      children: [
        {
          path: '/router/inventoryList',
          component: InventoryList,
          name: '库存列表',
          hidden: false
        }, {
          path: '/router/addAntique',
          component: AddAntique,
          name: '增加文物',
          hidden: true
        }, {
          path: '/router/editAntique',
          component: AddAntique,
          name: '编辑文物',
          hidden: true
        }
      ]
    }
  ]
})
