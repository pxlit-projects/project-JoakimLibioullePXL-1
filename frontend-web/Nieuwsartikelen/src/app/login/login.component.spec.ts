import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    // Configureer de testmodule
    TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent], // Voeg FormsModule toe om template bindingen te ondersteunen
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Voer change detection uit om de component correct te renderen
  });

  afterEach(() => {
    localStorage.clear(); // Zorg ervoor dat localStorage schoon is na elke test
  });

  it('moet de component correct initialiseren', () => {
    expect(component).toBeTruthy();
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('moet een correcte gebruiker kunnen inloggen', () => {
    // Geef input takel waarde
    component.username = 'gebruiker';
    component.password = '123';

    // Roep de login-methode aan
    spyOn(window, 'alert'); // Mock het alert-venster
    component.login();

    // Controleer of de gebruikersgegevens correct worden verwerkt
    expect(localStorage.getItem('userRole')).toBe('Gebruiker');
    expect(window.alert).toHaveBeenCalledWith('Welkom gebruiker! Je rol is: Gebruiker');
    expect(component.errorMessage).toBe(''); // Geen foutbericht
  });

  it('moet een foutmelding tonen bij ongeldige inloggegevens', () => {
    component.username = 'verkeerdeGebruiker';
    component.password = '123';

    component.login();

    expect(component.errorMessage).toBe('Ongeldige gebruikersnaam of wachtwoord!');
    expect(localStorage.getItem('userRole')).toBeNull(); // Geen rol wordt opgeslagen
  });

  it('moet geen inlogactie ondernemen als velden leeg zijn', () => {
    component.username = '';
    component.password = '';

    component.login();

    expect(component.errorMessage).toBe('Ongeldige gebruikersnaam of wachtwoord!');
    expect(localStorage.getItem('userRole')).toBeNull();
  });

  it('moet schakelen tussen gebruikers met verschillende rollen', () => {
    component.username = 'redacteur';
    component.password = '123';

    spyOn(window, 'alert'); // Mock het alert-venster
    component.login();

    expect(localStorage.getItem('userRole')).toBe('Redacteur');
    expect(window.alert).toHaveBeenCalledWith('Welkom redacteur! Je rol is: Redacteur');
    expect(component.errorMessage).toBe('');
  });

  it('moet een foutmelding tonen als er geen overeenkomende gebruikers zijn', () => {
    component.username = 'onbekend';
    component.password = 'onjuist';

    component.login();

    expect(component.errorMessage).toBe('Ongeldige gebruikersnaam of wachtwoord!');
    expect(localStorage.getItem('userRole')).toBeNull(); // Geen toegangsrechten opgeslagen
  });

});
