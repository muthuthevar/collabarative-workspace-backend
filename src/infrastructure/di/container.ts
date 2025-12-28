// Services
import { JwtAuthService } from "../../adapters/services/JwtAuthService.js";
import { RedisCacheService } from "../../adapters/services/RedisCacheService.js";
import { MockEmailService } from "../../adapters/services/MockEmailService.js";
import { WinstonLogger } from "../../adapters/services/WinstonLogger.js";
import { SocketIOWebSocketService } from "../../adapters/services/SocketIOWebSocketService.js";
import { MockJobQueue } from "../../adapters/services/MockJobQueue.js";

// Repositories
import { InMemoryUserRepository } from "../../adapters/repositories/InMemoryUserRepository.js";
import { InMemoryProjectRepository } from "../../adapters/repositories/InMemoryProjectRepository.js";
import { InMemoryWorkspaceRepository } from "../../adapters/repositories/InMemoryWorkspaceRepository.js";
import { InMemoryProjectMemberRepository } from "../../adapters/repositories/InMemoryProjectMemberRepository.js";
import { InMemoryJobRepository } from "../../adapters/repositories/InMemoryJobRepository.js";
import { InMemoryActivityRepository } from "../../adapters/repositories/InMemoryActivityRepository.js";

// Use Cases - Auth
import { RegisterUser } from "../../use-cases/auth/RegisterUser.js";
import { LoginUser } from "../../use-cases/auth/LoginUser.js";
import { RefreshToken } from "../../use-cases/auth/RefreshToken.js";
import { ValidateToken } from "../../use-cases/auth/ValidateToken.js";

// Use Cases - Projects
import { CreateProject } from "../../use-cases/projects/CreateProject.js";
import { GetProject } from "../../use-cases/projects/GetProject.js";
import { ListProjects } from "../../use-cases/projects/ListProjects.js";
import { UpdateProject } from "../../use-cases/projects/UpdateProject.js";
import { DeleteProject } from "../../use-cases/projects/DeleteProject.js";

// Use Cases - Workspaces
import { CreateWorkspace } from "../../use-cases/workspaces/CreateWorkspace.js";
import { ListWorkspaces } from "../../use-cases/workspaces/ListWorkspaces.js";

// Use Cases - Members
import { InviteMember } from "../../use-cases/members/InviteMember.js";
import { ListMembers } from "../../use-cases/members/ListMembers.js";

// Use Cases - Jobs
import { SubmitJob } from "../../use-cases/jobs/SubmitJob.js";
import { GetJobStatus } from "../../use-cases/jobs/GetJobStatus.js";

// Use Cases - Collaboration
import { BroadcastEvent } from "../../use-cases/colloboration/BroadcastEvent.js";
import { GetActivityHistory } from "../../use-cases/colloboration/GetActivityHistory.js";

// Controllers
import { AuthController } from "../../adapters/controllers/AuthController.js";
import { ProjectController } from "../../adapters/controllers/ProjectController.js";
import { WorkspaceController } from "../../adapters/controllers/WorkspaceController.js";
import { MemberController } from "../../adapters/controllers/MemberController.js";
import { JobController } from "../../adapters/controllers/JobController.js";
import { CollaborationController } from "../../adapters/controllers/CollaborationController.js";

// Middleware
import { AuthMiddleware } from "../http/middleware/authMiddleware.js";

export class Container {
  // Services
  public logger = new WinstonLogger();
  public authService = new JwtAuthService();
  public cacheService = new RedisCacheService();
  public emailService = new MockEmailService(this.logger);
  public webSocketService = new SocketIOWebSocketService(this.logger);
  public jobQueue = new MockJobQueue(this.logger);

  // Repositories
  public userRepository = new InMemoryUserRepository();
  public projectRepository = new InMemoryProjectRepository();
  public workspaceRepository = new InMemoryWorkspaceRepository();
  public projectMemberRepository = new InMemoryProjectMemberRepository();
  public jobRepository = new InMemoryJobRepository();
  public activityRepository = new InMemoryActivityRepository();

  // Use Cases - Auth
  public registerUser = new RegisterUser(this.userRepository, this.authService);

  public loginUser = new LoginUser(this.userRepository, this.authService);

  public refreshToken = new RefreshToken(this.userRepository, this.authService);

  public validateToken = new ValidateToken(
    this.userRepository,
    this.authService
  );

  // Use Cases - Projects
  public createProject = new CreateProject(
    this.projectRepository,
    this.userRepository,
    this.cacheService
  );

  public getProject = new GetProject(
    this.projectRepository,
    this.projectMemberRepository,
    this.cacheService
  );

  public listProjects = new ListProjects(
    this.projectRepository,
    this.cacheService
  );

  public updateProject = new UpdateProject(
    this.projectRepository,
    this.cacheService
  );

  public deleteProject = new DeleteProject(
    this.projectRepository,
    this.workspaceRepository,
    this.cacheService
  );

  // Use Cases - Workspaces
  public createWorkspace = new CreateWorkspace(
    this.workspaceRepository,
    this.projectRepository,
    this.projectMemberRepository
  );

  public listWorkspaces = new ListWorkspaces(
    this.workspaceRepository,
    this.projectRepository,
    this.projectMemberRepository
  );

  // Use Cases - Members
  public inviteMember = new InviteMember(
    this.projectMemberRepository,
    this.projectRepository,
    this.userRepository,
    this.emailService
  );

  public listMembers = new ListMembers(
    this.projectMemberRepository,
    this.projectRepository
  );

  // Use Cases - Jobs
  public submitJob = new SubmitJob(this.jobRepository, this.jobQueue);

  public getJobStatus = new GetJobStatus(this.jobRepository);

  // Use Cases - Collaboration
  public broadcastEvent = new BroadcastEvent(
    this.activityRepository,
    this.webSocketService
  );

  public getActivityHistory = new GetActivityHistory(
    this.activityRepository,
    this.projectRepository,
    this.projectMemberRepository
  );

  // Controllers
  public authController = new AuthController(
    this.registerUser,
    this.loginUser,
    this.refreshToken,
    this.validateToken
  );

  public projectController = new ProjectController(
    this.createProject,
    this.getProject,
    this.listProjects,
    this.updateProject,
    this.deleteProject
  );

  public workspaceController = new WorkspaceController(
    this.createWorkspace,
    this.listWorkspaces
  );

  public memberController = new MemberController(
    this.inviteMember,
    this.listMembers
  );

  public jobController = new JobController(this.submitJob, this.getJobStatus);

  public collaborationController = new CollaborationController(
    this.broadcastEvent,
    this.getActivityHistory
  );

  // Middleware
  public authMiddleware = new AuthMiddleware(
    this.authService,
    this.userRepository
  );
}
