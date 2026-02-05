-- Add read policies for donor applications
CREATE POLICY "Allow public read to donor applications" ON donor_applications
  FOR SELECT USING (true);

-- Add read policies for blood test requests
CREATE POLICY "Allow public read to blood test requests" ON blood_test_requests
  FOR SELECT USING (true);

-- Add update policies for status changes (optional - can be restricted later)
CREATE POLICY "Allow public update to donor applications status" ON donor_applications
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public update to blood test requests status" ON blood_test_requests
  FOR UPDATE USING (true) WITH CHECK (true);
