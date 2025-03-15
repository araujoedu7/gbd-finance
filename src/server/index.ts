import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes, Model } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', '..', 'database.sqlite'),
  logging: false,
});

// Models
interface StudentAttributes {
  id: number;
  name: string;
  phone: string;
  Payments?: Payment[];
}

interface PaymentAttributes {
  id: number;
  month: number;
  year: number;
  status: 'paid' | 'unpaid';
  paidAt: Date | null;
  StudentId: number;
}

interface PaymentCreationAttributes extends Omit<PaymentAttributes, 'id'> {}

class Student extends Model<StudentAttributes> implements StudentAttributes {
  public id!: number;
  public name!: string;
  public phone!: string;
  public Payments?: Payment[];
}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public month!: number;
  public year!: number;
  public status!: 'paid' | 'unpaid';
  public paidAt!: Date | null;
  public StudentId!: number;
}

Student.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'Student' }
);

Payment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('paid', 'unpaid'), allowNull: false, defaultValue: 'unpaid' },
    paidAt: { type: DataTypes.DATE, allowNull: true },
    StudentId: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, modelName: 'Payment' }
);

Student.hasMany(Payment);
Payment.belongsTo(Student);

// Routes
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.findAll({ include: [Payment] });
    res.json(students);
  } catch (error) {
    console.error('Erro ao buscar estudantes:', error);
    res.status(500).json({ error: 'Erro ao buscar estudantes' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    console.error('Erro ao criar estudante:', error);
    res.status(500).json({ error: 'Erro ao criar estudante' });
  }
});

app.put('/api/students/:id/payment', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'ID do estudante inválido' });
    }

    const { month, year, status, paidAt } = req.body;

    console.log('Recebido payload:', { studentId, month, year, status, paidAt });

    // Validar e converter dados
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'Mês inválido' });
    }

    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({ error: 'Ano inválido' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório' });
    }

    if (!['paid', 'unpaid'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido, deve ser paid ou unpaid' });
    }

    const student = await Student.findByPk(studentId);
    if (!student) {
      console.log('Estudante não encontrado:', studentId);
      return res.status(404).json({ error: 'Estudante não encontrado' });
    }

    try {
      // Procura ou cria o pagamento
      const [paymentRecord, created] = await Payment.findOrCreate({
        where: { 
          StudentId: studentId, 
          month: monthNum, 
          year: yearNum 
        },
        defaults: {
          StudentId: studentId,
          month: monthNum,
          year: yearNum,
          status: status as 'paid' | 'unpaid',
          paidAt: status === 'paid' ? new Date() : null
        }
      });

      if (!created) {
        // Se o pagamento já existia, atualiza
        await paymentRecord.update({
          status: status as 'paid' | 'unpaid',
          paidAt: status === 'paid' ? new Date() : null
        });
      }

      // Busca o estudante atualizado com todos os pagamentos
      const updatedStudent = await Student.findByPk(studentId, { 
        include: [{
          model: Payment,
          required: false
        }],
        order: [
          [Payment, 'year', 'DESC'],
          [Payment, 'month', 'ASC']
        ]
      });

      if (!updatedStudent) {
        console.log('Estudante não encontrado após atualização');
        return res.status(404).json({ error: 'Estudante não encontrado após atualização' });
      }

      // Verifica se o pagamento foi atualizado corretamente
      const updatedPayment = updatedStudent.Payments?.find(
        p => p.month === monthNum && p.year === yearNum
      );

      if (!updatedPayment) {
        console.log('Pagamento não encontrado após atualização');
        return res.status(500).json({ error: 'Pagamento não encontrado após atualização' });
      }

      if (updatedPayment.status !== status) {
        console.log('Status do pagamento não foi atualizado corretamente:', {
          expected: status,
          received: updatedPayment.status
        });
        return res.status(500).json({ 
          error: 'Status do pagamento não foi atualizado corretamente',
          expected: status,
          received: updatedPayment.status
        });
      }

      console.log('Pagamento atualizado com sucesso:', updatedPayment.toJSON());
      res.json(updatedStudent);
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao salvar/atualizar pagamento:', error);
      return res.status(500).json({ 
        error: 'Erro ao salvar/atualizar pagamento', 
        details: error.message 
      });
    }
  } catch (err) {
    const error = err as Error;
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar pagamento', 
      details: error.message 
    });
  }
});

// Start server
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  })
  .catch(error => console.error('Erro ao sincronizar banco de dados:', error));
