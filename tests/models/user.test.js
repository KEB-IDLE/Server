const { Sequelize, DataTypes } = require('sequelize');
const defineUser = require('../../src/models/user');

describe('User model', () => {
  let sequelize;
  let User;

  beforeAll(() => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    User = defineUser(sequelize, DataTypes);
  });

  test('User 모델이 정상적으로 생성되어야 한다', () => {
    expect(User).toBeDefined();
    expect(User.tableName).toBe('user');
  });

  test('User 모델의 필드가 잘 정의되어 있어야 한다', () => {
    const attributes = User.rawAttributes;

    expect(attributes).toHaveProperty('id');
    expect(attributes.id.primaryKey).toBe(true);
    expect(attributes).toHaveProperty('email');
    expect(attributes.email.allowNull).toBe(false);
    expect(attributes.email.unique).toBe(true);
  });

  test('User 인스턴스를 생성하고 저장할 수 있어야 한다', async () => {
    await sequelize.sync({ force: true }); // 테이블 생성

    const user = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword',
    });

    expect(user.id).toBeGreaterThan(0);
    expect(user.email).toBe('test@example.com');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
