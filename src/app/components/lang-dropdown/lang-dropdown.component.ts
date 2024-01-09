import { Component } from '@angular/core';

@Component({
  selector: 'app-lang-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './lang-dropdown.component.html'
})
export class LangDropdownComponent {
  isDropdownHidden = true;

  toggleDropdown() {
    this.isDropdownHidden = !this.isDropdownHidden;
  }

  closeDropDown() {
    this.isDropdownHidden = true;
  }
}
