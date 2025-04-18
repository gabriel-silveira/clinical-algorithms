import { LocalStorage } from 'quasar';

import {
  describe,
  it,
  vi,
  expect,
  beforeEach,
} from 'vitest';

import { api } from 'boot/axios';
import Users, { IUser } from 'src/services/users';

vi.mock('boot/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('quasar', () => ({
  LocalStorage: {
    getItem: vi.fn(),
  },
}));

describe('Users', () => {
  let usersService: Users;

  beforeEach(() => {
    usersService = new Users();
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('deve buscar lista de usuários quando há token', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'Usuário 1',
          email: 'email1@teste.com',
        },
        {
          id: 2,
          name: 'Usuário 2',
          email: 'email2@teste.com',
        },
      ];

      vi.mocked(LocalStorage.getItem)
        .mockReturnValue('fake-token');
      vi.mocked(api.get)
        .mockResolvedValueOnce({ data: mockUsers });

      await usersService.get();

      expect(usersService.data.users)
        .toEqual(mockUsers);
      expect(api.get)
        .toHaveBeenCalledWith('users');
    });

    it('deve retornar false quando não há token', async () => {
      vi.mocked(LocalStorage.getItem)
        .mockReturnValue(null);

      const result = await usersService.get();

      expect(result)
        .toBe(false);
      expect(api.get)
        .not
        .toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const newUser = {
        name: 'Novo Usuário',
        email: 'novo@teste.com',
        password: '123456',
        phone: '123456789',
        maintainer: false,
        master: false,
        updatedAt: '',
      };

      usersService.data.user = newUser;
      vi.mocked(api.post)
        .mockResolvedValueOnce({ data: { success: true } });

      const result = await usersService.create();

      expect(result)
        .toBe(true);
      expect(api.post)
        .toHaveBeenCalledWith('users', newUser);
      expect(usersService.data.showEditDialog)
        .toBe(false);
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário existente', async () => {
      const updateData = {
        id: 1,
        name: 'Usuário Atualizado',
        email: 'atualizado@teste.com',
        password: '',
        phone: '987654321',
        maintainer: true,
        master: false,
        updatedAt: '',
      };

      usersService.data.user = updateData;
      vi.mocked(api.put)
        .mockResolvedValueOnce({ data: { success: true } });

      const result = await usersService.update();

      expect(result)
        .toBe(true);
      expect(api.put)
        .toHaveBeenCalledWith('users', updateData);
      expect(usersService.data.showEditDialog)
        .toBe(false);
    });
  });

  describe('delete', () => {
    it('deve deletar um usuário', async () => {
      const userId = 1;
      usersService.data.user = { id: userId } as IUser;

      vi.mocked(api.delete)
        .mockResolvedValueOnce({ data: { success: true } });

      const result = await usersService.delete();

      expect(result)
        .toBe(true);
      expect(api.delete)
        .toHaveBeenCalledWith(`users/${userId}`);
      expect(usersService.data.showEditDialog)
        .toBe(false);
    });
  });

  describe('search', () => {
    it('deve buscar usuários com palavra-chave', async () => {
      const mockResults = [
        {
          id: 1,
          name: 'Usuário Encontrado',
          email: 'encontrado@teste.com',
        },
      ];

      vi.mocked(api.get)
        .mockResolvedValueOnce({ data: mockResults });

      await usersService.search('Usuário');

      expect(usersService.data.searchResults)
        .toEqual(mockResults);
      expect(usersService.data.totalSearchResult)
        .toBe(1);
      expect(api.get)
        .toHaveBeenCalledWith('users/search?keyword=Usuário');
    });
  });

  describe('usersList', () => {
    it('deve retornar resultados da busca quando houver totalSearchResult', () => {
      const searchResults = [{
        id: 1,
        name: 'Resultado',
      } as IUser];
      usersService.data.searchResults = searchResults;
      usersService.data.totalSearchResult = 1;

      expect(usersService.usersList)
        .toEqual(searchResults);
    });

    it('deve retornar lista de usuários quando não houver busca', () => {
      const users = [{
        id: 1,
        name: 'Usuario',
      } as IUser];
      usersService.data.users = users;
      usersService.data.totalSearchResult = null;

      expect(usersService.usersList)
        .toEqual(users);
    });
  });

  describe('getUserName', () => {
    it('deve retornar nome do usuário quando encontrado', () => {
      usersService.data.users = [
        {
          id: 1,
          name: 'Usuário 1',
        } as IUser,
        {
          id: 2,
          name: 'Usuário 2',
        } as IUser,
      ];

      expect(usersService.getUserName(1))
        .toBe('Usuário 1');
    });

    it('deve retornar "No definido" quando usuário não for encontrado', () => {
      usersService.data.users = [];

      expect(usersService.getUserName(1))
        .toBe('No definido');
    });
  });
});
