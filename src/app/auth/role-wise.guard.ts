import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { StorageKey } from '../constent/storage-key';
import { AuthenticationService } from '../services/authentication.service';
import { SecureLocalStorageService } from '../services/secure-local-storage.service';

export const roleWiseGuard: CanActivateFn = (route, state) => {
 const router = inject(Router);
  const authDetails = inject(SecureLocalStorageService);
  const authService = inject(AuthenticationService);

  const token = JSON.parse(authDetails.decryptAndGet(StorageKey.JWT_TOKEN) || 'null');
  const userDetail = JSON.parse(authDetails.decryptAndGet(StorageKey.USER) || 'null');

  if (!token || !userDetail || !userDetail.role || userDetail.role.length === 0) {
    return false;
  }

  // Get required roles from route data
  const requiredRoles: string[] = route.data['roles'] || [];
  const userRoles: string[] = userDetail.role.map((role: string) => role.toUpperCase());

  // Check if user has at least one required role
  const hasAccess = requiredRoles.some((role) => userRoles.includes(role.toUpperCase()));

  if (!hasAccess) {
    router.navigate(['/unauthorized']); // Redirect if no access
    return false;
  }

  return hasAccess;
};

export const authRollwiseChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return roleWiseGuard(childRoute, state); // Reuse parent guard logic
};
