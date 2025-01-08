import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing'; // Voor router functionaliteit
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from './navbar/navbar.component';
import { PostPublishedListComponent } from './post-publishedlist/post-publishedlist.component';
import { PostConceptListComponent } from './post-conceptlist/post-conceptlist.component';
import {RouterOutlet} from "@angular/router";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule, // Simuleer routing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy(); // Controleer dat de component correct wordt aangemaakt
  });

  it('should have a title "Nieuwsartikelen"', () => {
    expect(component.title).toBe('Nieuwsartikelen'); // Controleer of de titel correct is ingesteld
  });

  it('should render the NavbarComponent', () => {
    const navbar = debugElement.query(By.directive(NavbarComponent)); // Zoek naar de NavbarComponent in de DOM
    expect(navbar).not.toBeNull(); // Controleer dat NavbarComponent is gerenderd
  });

  it('should have a RouterOutlet', () => {
    const routerOutlet = debugElement.query(By.directive(RouterOutlet)); // Zoek naar de RouterOutlet in de DOM
    expect(routerOutlet).not.toBeNull(); // Controleer dat de RouterOutlet is toegevoegd
  });
});
