import { confirmLeaveGuard } from './confirm-leave.guard';
import { AddPostComponent } from './add-post/add-post.component';
import {FormGroup} from "@angular/forms";
import {ActivatedRouteSnapshot} from "@angular/router";

describe('confirmLeaveGuard', () => {
  let mockComponent: jasmine.SpyObj<AddPostComponent>;

  beforeEach(() => {
    // Mock het AddPostComponent met een "postForm" eigenschap
    mockComponent = jasmine.createSpyObj<AddPostComponent>('AddPostComponent', [], {
      postForm: new FormGroup({}, { updateOn: 'change' }) // Een lege FormGroup om typecompatibiliteit te behouden
    });
    Object.defineProperty(mockComponent.postForm, 'dirty', { value: false, writable: true }); // Dirty eigenschap mocken
  });

  it('should allow navigation if the form is not dirty', () => {
    // Arrange
    mockComponent.postForm = new FormGroup({}, { updateOn: 'change' });
    Object.defineProperty(mockComponent.postForm, 'dirty', { value: false });

    // Act
    const result = confirmLeaveGuard(mockComponent, {} as any, {} as any, {} as any);

    // Assert
    expect(result).toBeTrue(); // Navigatie wordt toegestaan
  });

  it('should confirm navigation if the form is dirty', () => {
    // Arrange
    mockComponent.postForm = new FormGroup({}, { updateOn: 'change' });
    Object.defineProperty(mockComponent.postForm, 'dirty', { value: true });
    spyOn(window, 'confirm').and.returnValue(true); // Stel de confirm-box in om "OK" te simuleren

    // Act
    const result = confirmLeaveGuard(mockComponent, {} as ActivatedRouteSnapshot, {} as any, {} as any);

    // Assert
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to leave this page?');
    expect(result).toBeTrue(); // Navigatie wordt toegestaan als de gebruiker "OK" kiest
  });

  it('should block navigation if the form is dirty and the user cancels', () => {
    // Arrange
    mockComponent.postForm = new FormGroup({}, { updateOn: 'change' });
    Object.defineProperty(mockComponent.postForm, 'dirty', { value: true });
    spyOn(window, 'confirm').and.returnValue(false); // Stel de confirm-box in om "Annuleren" te simuleren

    // Act
    const result = confirmLeaveGuard(mockComponent, {} as ActivatedRouteSnapshot, null as any, null as any);

    // Assert
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to leave this page?');
    expect(result).toBeFalse(); // Navigatie wordt geblokkeerd als de gebruiker "Annuleren" kiest
  });
});
