import { Request, Response } from 'express';
import { AdminServiceImpl } from '../services/impl/AdminServiceImpl.js';

class AdminController {
    
      private adminService: AdminServiceImpl;
    
      constructor() {
        this.adminService = new AdminServiceImpl();
      }
}

export default AdminController;