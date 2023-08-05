import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceRequisicao } from './app.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map, startWith } from 'rxjs/operators';
import { Post } from './model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  dados: Post[] = [];
  paginatedData: Post[] = [];
  searchControl: FormControl = new FormControl('');
  searchForm: FormGroup;

  pageSize = 5;
  currentPageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ServiceRequisicao, private router: Router) {
    this.searchForm = new FormGroup({
      search: this.searchControl
    });
  }

  ngOnInit(): void {
    this.listar();
    this.initSearchFilter();
  }

  private initSearchFilter() {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => value.toLowerCase()),
      map((termoPesquisa) => {
        if (termoPesquisa.trim() === '') {
          return this.dados;
        } else {
          return this.dados.filter((post) => post.title.toLowerCase().includes(termoPesquisa));
        }
      })
    ).subscribe((filteredData) => {
      this.paginatedData = filteredData.slice(0, this.pageSize);
      this.currentPageIndex = 0;
    });
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    this.paginatedData = this.dados.slice(startIndex, startIndex + event.pageSize);
    this.currentPageIndex = event.pageIndex;
  }

  listar() {
    this.service.getRequisicao().subscribe(
      (data: Post[]) => {
        this.dados = data;
        this.paginatedData = this.dados.slice(0, this.pageSize); // Inicializa paginatedData com os dados completos
      },
      (error) => {
        console.error('Erro na requisição:', error);
      }
    );
  }

  limparFiltro() {
    this.searchControl.setValue('');
    this.listar();
  }

  getDisplayedPageNumbers(): number[] {
    const totalPages = Math.ceil(this.dados.length / this.pageSize);
    const firstPageIndex = Math.max(0, this.currentPageIndex - 1);
    const lastPageIndex = Math.min(totalPages - 1, firstPageIndex + 2);
    return Array.from({ length: lastPageIndex - firstPageIndex + 1 }, (_, i) => firstPageIndex + i + 1);
  }

  onPreviousClick() {
    if (this.currentPageIndex > 0) {
      this.onPageClick(this.currentPageIndex);
    }
  }

  onPageClick(page: number) {
    this.currentPageIndex = page - 1;
    const startIndex = this.currentPageIndex * this.pageSize;
    this.paginatedData = this.dados.slice(startIndex, startIndex + this.pageSize);
  }

  onNextClick() {
    const totalPages = Math.ceil(this.dados.length / this.pageSize);
    if (this.currentPageIndex < totalPages - 1) {
      this.onPageClick(this.currentPageIndex + 2);
    }
  }

}
