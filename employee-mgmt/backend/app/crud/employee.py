from sqlalchemy.orm import Session
from sqlalchemy import select, or_, func
from app.models.employee import Employee, EmployeeStatus
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from typing import List, Optional, Tuple

def create_employee(db: Session, data: EmployeeCreate) -> Employee:
    obj = Employee(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_employee(db: Session, employee_id: int) -> Optional[Employee]:
    return db.get(Employee, employee_id)

def get_employee_by_email(db: Session, email: str) -> Optional[Employee]:
    return db.scalar(select(Employee).where(Employee.email == email))

def list_employees(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    department: Optional[str] = None,
    status: Optional[EmployeeStatus] = None,
) -> Tuple[List[Employee], int]:
    stmt = select(Employee)
    count_stmt = select(func.count()).select_from(Employee)

    if search:
        like = f"%{search}%"
        cond = or_(Employee.first_name.like(like), Employee.last_name.like(like), Employee.email.like(like))
        stmt = stmt.where(cond)
        count_stmt = count_stmt.where(cond)

    if department:
        stmt = stmt.where(Employee.department == department)
        count_stmt = count_stmt.where(Employee.department == department)

    if status:
        stmt = stmt.where(Employee.status == status)
        count_stmt = count_stmt.where(Employee.status == status)

    total = db.scalar(count_stmt) or 0
    results = db.execute(stmt.offset(skip).limit(limit)).scalars().all()
    return results, total

def update_employee(db: Session, employee: Employee, data: EmployeeUpdate) -> Employee:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee

def delete_employee(db: Session, employee: Employee) -> None:
    db.delete(employee)
    db.commit()