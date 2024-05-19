@startuml

entity User {
  *username : String
  *email : String
  *password : String
  *created_at : Date
}

entity Task {
  *title : String
  *description : String
  *status : String
  *due_date : Date
  *created_at : Date
  *updated_at : Date
  *user_id : String
}

User "1" --> "0..*" Task : owns

entity UserController {
  +register()
  +login()
}

entity TaskController {
  +createTask()
  +getTasks()
  +updateTask()
  +deleteTask()
  +toggleTaskStatus()
}

entity UserRoutes {
  +POST /api/register
  +POST /api/login
}

entity TaskRoutes {
  +POST /api/tasks
  +GET /api/tasks
  +PUT /api/tasks/{id}
  +DELETE /api/tasks/{id}
  +PATCH /api/tasks/{id}/status
}

UserController --> UserRoutes : manages
TaskController --> TaskRoutes : manages

UserController --> User : uses
TaskController --> Task : uses

@enduml