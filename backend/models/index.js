import { Sequelize, Model, DataTypes } from 'sequelize';

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

export const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  logging: false,
});

// ─── User ────────────────────────────────────────────────────────
export class User extends Model {}
User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 64],
        // Only alphanumeric + underscore — prevents injection via username
        is: /^[a-zA-Z0-9_\u4e00-\u9fff]+$/,
      },
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    avatarPath: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'user', tableName: 'users', timestamps: true }
);

// ─── Comment ─────────────────────────────────────────────────────
export class Comment extends Model {}
Comment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [1, 2000] },
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'comment', tableName: 'comments', timestamps: true }
);

// Associations
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

export async function syncDB() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('DB synced');
}
