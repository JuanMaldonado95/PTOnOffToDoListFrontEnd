import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api-service';
import { AuthService } from './auth-service';
import { HttpParams } from '@angular/common/http';

const BASE_URL = 'https://localhost:44363/api';
const mockToken = 'mock-jwt-token-123';

class MockAuthService {
  getToken = jasmine.createSpy('getToken');
}

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Debe incluir el encabezado Content-Type en la solicitud GET (sin token)', () => {
    mockAuthService.getToken.and.returnValue(null);
    const testPath = '/data';

    service.get(testPath).subscribe();

    const req = httpTestingController.expectOne(`${BASE_URL}${testPath}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('Debe incluir el encabezado Authorization en la solicitud GET (con token)', () => {
    mockAuthService.getToken.and.returnValue(mockToken);
    const testPath = '/secure';

    service.get(testPath).subscribe();

    const req = httpTestingController.expectOne(`${BASE_URL}${testPath}`);
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('Debe manejar HttpParams en la solicitud GET', () => {
    mockAuthService.getToken.and.returnValue(null);
    const testPath = '/search';
    const testParams = new HttpParams().set('query', 'test');

    service.get(testPath, testParams).subscribe();

    const req = httpTestingController.expectOne(`${BASE_URL}${testPath}?query=test`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('query')).toEqual('test');
    req.flush({});
  });

  it('Debe enviar solicitud POST con cuerpo y encabezados correctos', () => {
    mockAuthService.getToken.and.returnValue(mockToken);
    const testPath = '/create';
    const testBody = { name: 'New Item' };

    service.post(testPath, testBody).subscribe();

    const req = httpTestingController.expectOne(`${BASE_URL}${testPath}`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testBody);
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('Debe enviar solicitud PUT con cuerpo y encabezados correctos', () => {
    mockAuthService.getToken.and.returnValue(mockToken);
    const testPath = '/update/1';
    const testBody = { id: 1, status: 'updated' };

    service.put(testPath, testBody).subscribe();

    const req = httpTestingController.expectOne(`${BASE_URL}${testPath}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(testBody);
    req.flush({});
  });

  it('Debe enviar solicitud DELETE con encabezados correctos', () => {
    mockAuthService.getToken.and.returnValue(mockToken);
    const testPath = '/delete/1';

    service.delete(testPath).subscribe();

    const req = httpTestingController.expectOne(`${BASE_URL}${testPath}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${mockToken}`);
    req.flush({});
  });
});