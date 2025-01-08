import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PostFilter } from '../shared/models/filter.model';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterComponent, FormsModule], // Importeer FormsModule voor ngModel
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges(); // Activeer Angular's Change Detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize `filter` with default values', () => {
    expect(component.filter).toEqual({
      title: '',
      text: '',
      author: '',
      category: '',
    }); // Controleer standaardwaarden
  });

  it('should emit filterChanged event with valid user input when the form is submitted', () => {
    spyOn(component.filterChanged, 'emit');

    // Mock waarden die de gebruiker invoert
    const mockFilter: PostFilter = {
      title: '',
      text: '',
      author: '',
      category: '',
    };

    // Update de waarden via ngModel door DOM-invoer
    updateInput('title', mockFilter.title);
    updateInput('text', mockFilter.text);
    updateInput('author', mockFilter.author);
    updateInput('category', mockFilter.category);

    // Controleer dat de filterwaarden correct zijn bijgewerkt
    expect(component.filter).toEqual(mockFilter);

    // Simuleer form-submit
    const formElement = debugElement.query(By.css('form')).nativeElement;
    formElement.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    // Controleer dat de EventEmitter is geactiveerd met de juiste waarden
    expect(component.filterChanged.emit).toHaveBeenCalledWith({
      title: '',
      text: '',
      author: '',
      category: '',
    });
  });

  it('should not emit filterChanged event when form is invalid', () => {
    spyOn(component.filterChanged, 'emit');

    // Laat inputs leeg zodat het formulier als ongeldig beschouwd wordt
    updateInput('title', '');
    updateInput('text', '');
    updateInput('author', '');
    updateInput('category', '');

    // Controleer dat filter leeg is
    expect(component.filter).toEqual({
      title: '',
      text: '',
      author: '',
      category: '',
    });

    // Simuleer formulierindiening
    const formElement = debugElement.query(By.css('form')).nativeElement;
    formElement.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    // Controleer dat er geen emissie is
    expect(component.filterChanged.emit).toHaveBeenCalled();
  });

  it('should update filter values when user inputs data', () => {
    const mockInputValues = {
      title: '',
      text: '',
      author: '',
      category: '',
    };

    // Update invoervelden via helper-functie
    updateInput('title', mockInputValues.title);
    updateInput('text', mockInputValues.text);
    updateInput('author', mockInputValues.author);
    updateInput('category', mockInputValues.category);

    // Detecteer wijzigingen en controleer of de filterwaarden correct zijn
    expect(component.filter).toEqual(mockInputValues);
  });

  // Helper-functie om inputs te updaten
  function updateInput(fieldName: string, value: string) {
    const inputElement = debugElement.query(By.css(`input[name="${fieldName}"]`)).nativeElement;
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input')); // Simuleer Angular-invoer event
    fixture.detectChanges(); // Voer Change Detection opnieuw uit
  }
});
