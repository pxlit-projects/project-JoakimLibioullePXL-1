import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Haal de rol van de gebruiker op (hier eenvoudig uit localStorage)
    const role = localStorage.getItem('userRole'); // "Gebruiker" of "Redacteur"

    // Controleer de vereiste rol
    if (route.data['role'] && route.data['role'] !== role) {
      alert('Je hebt geen toegang tot deze pagina!');
      this.router.navigate(['/published']); // Stuur de gebruiker naar een veilige pagina
      return false;
    }

    return true;
  }
}
