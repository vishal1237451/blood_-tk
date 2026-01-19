-- Blood Bank Management System Database Schema

-- Blood Inventory Table
CREATE TABLE IF NOT EXISTS blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blood_type VARCHAR(5) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donor Applications Table
CREATE TABLE IF NOT EXISTS donor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  blood_type VARCHAR(5) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  date_of_birth DATE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  address TEXT NOT NULL,
  medical_conditions TEXT,
  last_donation_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blood Test Requests Table
CREATE TABLE IF NOT EXISTS blood_test_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE NOT NULL,
  test_type VARCHAR(50) NOT NULL CHECK (test_type IN ('blood_typing', 'complete_blood_count', 'blood_sugar', 'hemoglobin', 'comprehensive')),
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(20) NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial blood inventory data
INSERT INTO blood_inventory (blood_type, units_available) VALUES
  ('A+', 45),
  ('A-', 12),
  ('B+', 38),
  ('B-', 8),
  ('AB+', 15),
  ('AB-', 5),
  ('O+', 62),
  ('O-', 22)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_test_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to inventory
CREATE POLICY "Allow public read access to blood inventory" ON blood_inventory
  FOR SELECT USING (true);

-- Create policies for public insert access to applications and requests
CREATE POLICY "Allow public insert to donor applications" ON donor_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to blood test requests" ON blood_test_requests
  FOR INSERT WITH CHECK (true);
