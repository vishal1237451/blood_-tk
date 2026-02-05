-- Add SELECT policies for reading data
CREATE POLICY "Allow public select donor applications" ON donor_applications
  FOR SELECT USING (true);

CREATE POLICY "Allow public select blood test requests" ON blood_test_requests
  FOR SELECT USING (true);

-- Add UPDATE policies for updating status
CREATE POLICY "Allow public update donor applications" ON donor_applications
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public update blood test requests" ON blood_test_requests
  FOR UPDATE USING (true) WITH CHECK (true);
