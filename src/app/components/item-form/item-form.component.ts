import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ItemFormComponent implements OnInit {
  itemForm!: FormGroup;
  isEditMode = false;
  itemId?: number;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.loadItemData(this.itemId);
      }
    });
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  loadItemData(id: number): void {
    this.itemService.getItem(id).subscribe(item => {
      if (item) {
        this.itemForm.patchValue({
          name: item.name,
          description: item.description
        });
      }
    });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) return;

    const formValue = this.itemForm.value;

    if (this.isEditMode && this.itemId) {
      const updatedItem: Item = {
        id: this.itemId,
        name: formValue.name,
        description: formValue.description
      };

      this.itemService.updateItem(updatedItem).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.itemService.addItem(formValue).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
