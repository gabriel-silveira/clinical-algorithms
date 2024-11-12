import { reactive } from 'vue';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { ALGORITHMS_PUBLIC_EDITOR, ALGORITHMS_PUBLIC_SEARCH } from 'src/router/routes/algorithms';
import { api } from 'boot/axios';

class Settings {
  private appName = 'PAHO';

  private readonly route: RouteLocationNormalizedLoaded;

  private router: Router | null = null;

  private userId = 0;

  public page: {
    setTitle: (title?: string) => void,
    title: string,
    mainMenu: boolean,
  } = reactive({
      setTitle: (title?: string) => {
        this.page.title = `${this.appName}${title ? ` - ${title}` : ''}`;

        window.document.title = this.page.title;
      },
      title: 'PAHO',
      mainMenu: true,
    });

  constructor(route: RouteLocationNormalizedLoaded, router?: Router) {
    this.route = route;

    if (router) {
      this.router = router;
    }
  }

  public setUser(userId: number) {
    this.userId = userId;
  }

  static isPublicView(routeName: string) {
    return [
      ALGORITHMS_PUBLIC_SEARCH,
      ALGORITHMS_PUBLIC_EDITOR,
    ].includes(routeName);
  }

  private async getUserRoles() {
    try {
      if (!this.userId) return Promise.resolve({ maintainer: false, master: false });

      const { data }: {
        data: {
          maintainer: number,
          master: number,
        }
      } = await api.get(`users/roles/${this.userId}`);

      const { maintainer, master } = data;

      return Promise.resolve({ maintainer, master });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async isMaintainer() {
    try {
      const { maintainer } = await this.getUserRoles();

      return Promise.resolve(!!maintainer);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async isMaster() {
    try {
      const { master } = await this.getUserRoles();

      return Promise.resolve(!!master);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default Settings;
