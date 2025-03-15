import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
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
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false
});

// Models
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('paid', 'unpaid'),
    allowNull: false,
    defaultValue: 'unpaid'
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['meeting', 'competition', 'training', 'other']]
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['high', 'medium', 'low']]
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Relationships
Student.hasMany(Payment);
Payment.belongsTo(Student);

// Routes
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [Payment]
    });
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
    const { id } = req.params;
    const payment = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Estudante não encontrado' });
    }

    const [paymentRecord] = await Payment.findOrCreate({
      where: {
        StudentId: id,
        month: payment.month,
        year: payment.year
      },
      defaults: {
        status: payment.status,
        paidAt: payment.paidAt
      }
    });

    if (paymentRecord) {
      await paymentRecord.update({
        status: payment.status,
        paidAt: payment.paidAt
      });
    }

    const updatedStudent = await Student.findByPk(id, {
      include: [Payment]
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar pagamento' });
  }
});

// Event Routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(400).json({ error: 'Erro ao criar evento' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(400).json({ error: 'Erro ao atualizar evento' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    await event.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    res.status(400).json({ error: 'Erro ao excluir evento' });
  }
});

// Notice Routes
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(notices);
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    res.status(500).json({ error: 'Erro ao buscar avisos' });
  }
});

app.post('/api/notices', async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (error) {
    console.error('Erro ao criar aviso:', error);
    res.status(400).json({ error: 'Erro ao criar aviso' });
  }
});

app.put('/api/notices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByPk(id);
    
    if (!notice) {
      return res.status(404).json({ error: 'Aviso não encontrado' });
    }

    await notice.update(req.body);
    res.json(notice);
  } catch (error) {
    console.error('Erro ao atualizar aviso:', error);
    res.status(400).json({ error: 'Erro ao atualizar aviso' });
  }
});

app.delete('/api/notices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByPk(id);
    
    if (!notice) {
      return res.status(404).json({ error: 'Aviso não encontrado' });
    }

    await notice.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir aviso:', error);
    res.status(400).json({ error: 'Erro ao excluir aviso' });
  }
});

// Initialize database and start server
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco de dados:', error);
  }); 