from sqlalchemy import Column, Integer, String, Date, Enum, DateTime, Numeric, func
import enum
from app.db import Base

class EmployeeStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    ON_LEAVE = "ON_LEAVE"
    TERMINATED = "TERMINATED"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    phone = Column(String(20), nullable=True)
    department = Column(String(100), nullable=True)
    title = Column(String(100), nullable=True)
    date_joined = Column(Date, nullable=False)
    salary = Column(Numeric(10,2), nullable=True)
    status = Column(Enum(EmployeeStatus), nullable=False, default=EmployeeStatus.ACTIVE)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Example method as part of OOP
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"