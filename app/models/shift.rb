class Shift < ActiveRecord::Base
  validates :start, presence: true
  validates :end, presence: true
  validate :start_less_than_end
  #validates :user, allow_nil: true

  belongs_to :user
  # where the shift will take place
  belongs_to :category

  private

  def start_less_than_end
    errors.add(:start, 'should be less than end') if start > self.send(:end)
  end
end
