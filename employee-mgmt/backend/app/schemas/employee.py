from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class EmployeeStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ON_LEAVE = "ON_LEAVE"
    TERMINATED = "TERMINATED"

class EmployeeBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    date_joined: date
    salary: Optional[float] = Field(default=None, ge=0)
    status: EmployeeStatus = EmployeeStatus.ACTIVE

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    date_joined: Optional[date] = None
    salary: Optional[float] = Field(default=None, ge=0)
    status: Optional[EmployeeStatus] = None

class EmployeeOut(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    # Pydantic v2 – allow loading from ORM objects
    model_config = ConfigDict(from_attributes=True)

class EmployeeList(BaseModel):
    items: List[EmployeeOut]
    total: int
    page: int
    page_size: int