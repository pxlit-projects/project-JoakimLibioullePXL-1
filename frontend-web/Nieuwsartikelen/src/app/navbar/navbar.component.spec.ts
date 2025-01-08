import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule], // Importeer de standalone component en router testing module
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance; // Haal een instantie van de component op
    debugElement = fixture.debugElement; // DebugElement voor DOM-queries
    fixture.detectChanges(); // Detecteer wijzigingen in de component
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Controleert dat de component correct wordt aangemaakt
  });

  it('should render the navigation links', () => {
    const navLinks = debugElement.queryAll(By.css('a')); // Zoek naar alle <a> elementen in de DOM
    expect(navLinks.length).toBeGreaterThan(0); // Controleer dat er navigatielinks zijn

    // Extra validatie: controleer de eerste router-link
    const firstLink = navLinks[0].nativeElement;
    expect(firstLink.getAttribute('href')).toBeTruthy(); // Controleer dat de link een geldige href heeft
  });

  it('should navigate to the correct path when a link is clicked', () => {
    const mockRouterLink = '/concepts'; // Stel een verwachte router-link waarde in
    const navLinks = debugElement.queryAll(By.css('a')); // Zoek naar alle <a> elementen

    if (navLinks.length > 0) {
      const firstLink = navLinks[0].nativeElement;
      expect(firstLink.getAttribute('ng-reflect-router-link')).toBe(mockRouterLink); // Controleer of de eerste link naar het juiste pad leidt
    } else {
      fail('No navigation links found in the component!'); // Error als er geen navigatielinks zijn
    }
  });
});
