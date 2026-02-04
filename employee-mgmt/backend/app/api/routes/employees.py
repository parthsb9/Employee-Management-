from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db import get_db
from app.crud.employee import (
    create_employee, get_employee, get_employee_by_email,
    list_employees, update_employee, delete_employee
)
from app.schemas.employee import (
    EmployeeCreate, EmployeeUpdate, EmployeeOut, EmployeeStatus, EmployeeList
)

router = APIRouter(prefix="/employees", tags=["employees"])

@router.post("", response_model=EmployeeOut, status_code=201)
def create_employee_endpoint(payload: EmployeeCreate, db: Session = Depends(get_db)):
    existing = get_employee_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already exists.")
    return create_employee(db, payload)

@router.get("", response_model=EmployeeList)
def list_employees_endpoint(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    department: Optional[str] = None,
    status: Optional[EmployeeStatus] = None,
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    items, total = list_employees(
        db,
        skip=skip,
        limit=page_size,
        search=search,
        department=department,
        status=status,
    )

    # Convert SQLAlchemy ORM -> Pydantic models
    items_out = [EmployeeOut.model_validate(emp, from_attributes=True) for emp in items]

    return EmployeeList(
        items=items_out,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee_endpoint(employee_id: int, db: Session = Depends(get_db)):
    emp = get_employee(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    # ensure serialization from ORM
    return EmployeeOut.model_validate(emp, from_attributes=True)

@router.put("/{employee_id}", response_model=EmployeeOut)
def update_employee_endpoint(employee_id: int, payload: EmployeeUpdate, db: Session = Depends(get_db)):
    emp = get_employee(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    if payload.email:
        existing = get_employee_by_email(db, payload.email)
        if existing and existing.id != employee_id:
            raise HTTPException(status_code=409, detail="Email already used by another employee.")
    updated = update_employee(db, emp, payload)
    return EmployeeOut.model_validate(updated, from_attributes=True)

@router.delete("/{employee_id}", status_code=204)
def delete_employee_endpoint(employee_id: int, db: Session = Depends(get_db)):
    emp = get_employee(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    delete_employee(db, emp)
    return None
